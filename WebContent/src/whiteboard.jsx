var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},

	render: function() {
		return (
			<article className="whiteboard">
				<WhiteboardHeader title={this.props.title} data={this.state.data.sprint} />
				<WhiteboardCanvas issues={this.props.data} columns={this.props.columns} />
			</article>
		);
	}
});

var WhiteboardHeader = React.createClass({
	render: function() {
		var data = this.props.data;

		// $('title').html(data.name);
		$('title').html('Team Whiteboard');

		return (
			<header>
				{/* <h2>{data.name}</h2> */}
				<h2>{'Team Whiteboard'}</h2>
			</header>
		);
	}
});

var WhiteboardCanvas = React.createClass({
	getInitialState: function() {
		return {
			taskLists: [],
			data: this.props.issues
		}
	},

	componentWillMount: function() {
		var _this = this;

		var issueStatus = this.props.columns;
		var issues = {};

		issueStatus.forEach(function(item) {
			issues[item] = [];
		});

		this.state.data.issues.forEach(function(item) {
			if (issues[item.fields.status.name]) {
				issues[item.fields.status.name].push(item);
			}
			else {
				console.warn("Unknown issue status: " + item.fields.status.name, item);
			}
		});

		this.state.taskLists = [];
		issueStatus.forEach(function(status) {
			_this.state.taskLists.push(
				<TaskList key={status} title={status} tasks={issues[status]} />
			);
		});

		this.setState(this.state);
	},

	componentDidMount: function() {
		$('.whiteboard .task-list-wrapper').css('width', 100 / this.props.columns.length + '%');
	},

	render: function() {
		return (
			<div className="whiteboard-canvas">
				{this.state.taskLists}
			</div>
		);
	}
});

var TaskList = React.createClass({
	getInitialState: function() {
		return {
			taskList: []
		}
	},

	componentWillMount: function() {
		var _this = this;
		this.state.totalPoints = 0;
		this.state.taskList = this.props.tasks.map(function(item) {
			if (item.fields.customfield_10152) {
				_this.state.totalPoints += Number(item.fields.customfield_10152);
			}
			return (
				<li key={item.key}><Task task={item} /></li>
			);
		});

		this.setState(this.state);
	},

	render: function() {
		return (
			<div className="task-list-wrapper">
				<h3>{this.props.title}</h3>
				<ul className="task-list">
					{this.state.taskList}
				</ul>
				<span className="well">{this.state.totalPoints} points</span>
			</div>
		);
	}
});

var Task = React.createClass({
	linkToJiraIssue: function(event) {
		if ($(event.target).closest('.issue').length) {
			window.open($(event.target).closest('.issue').attr('data-href'), '_blank');
		}
	},

	render: function() {
		var issue = this.props.task,
			issue_link = 'https://jira.eroad.io/browse/' + issue.key,
			issue_class_name = 'issue issue-' + issue.fields.issuetype.name.toLowerCase(),
			avatar_img = '';
		
		if (issue.fields.assignee && issue.fields.assignee.avatarUrls && issue.fields.assignee.avatarUrls['16x16']) {
			avatar_img = (
				<img className="issue-assignee-avatar" src={issue.fields.assignee.avatarUrls['16x16']} alt="" title={issue.fields.assignee.displayName} />
			);
		}

		return (
			<article className={issue_class_name} data-href={issue_link} onClick={this.linkToJiraIssue}>
				<header>
					<span className="issue-key">{issue.key}</span>
					<img className="issue-type-icon" src={issue.fields.issuetype.iconUrl} alt="" title={issue.fields.issuetype.name} />
				</header>
				<section className="issue-title">
					{issue.fields.summary}
				</section>
				<footer>
					{avatar_img}
					<span className="issue-assignee" title={issue.fields.assignee ? issue.fields.assignee.displayName : ''}>{issue.fields.assignee ? issue.fields.assignee.displayName : ''}</span>
					<span className="issue-estimate" title={issue.fields.customfield_10152}>{issue.fields.customfield_10152}</span>
				</footer>
			</article>
		);
	}
});