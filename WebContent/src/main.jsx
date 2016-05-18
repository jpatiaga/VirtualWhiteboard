var React = require('react');
var ReactDOM = require('react-dom');

var Whiteboard = require('./whiteboard.jsx');

var columns = {
	tolling: [
		"Pending Review",
		"Open",
		"Blocked",
		"In Progress",
		"In Test",
		"Done"
	],
	ca: [
		"Open",
		"In Progress",
		"In Review",
		"In Test",
		"Done"
	],
	platform: [
		"Open",
		"In Progress",
		"Testing / Peer Review",
		"Awaiting Release",
		"Closed"
	],
	gen2: [
		"Open",
		"In Progress",
		"In Review",
		"In Test",
		"Done"
	],
	best: [
		"Open",
		"In Progress",
		"Done"
	],
	driver: [
		"Open",
		"In Progress",
		"Ready for Test",
		"In Test",
		"Done"
	],
	aeon: [
		"Open",
		"In Progress",
		"Ready for Test",
		"In Test",
		"Done"
	]
};

var query_string = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
    return query_string;
}();

function fetchAndDisplay() {
	// Only call API on Monday - Friday from 7am to 7pm to save resources
	var date = new Date();
	if (date.getDay() < 1 || date.getDay() > 5
		|| date.getHours() < 7 || date.getHours > 18) {
		console.info('After hours. Not updating.');
		return;
	}

	var team = query_string && query_string.team ? query_string.team : 'tolling'; // default to Tolling team :)
	$.ajax({
	    url: "/VirtualWhiteboard/api/jiraService/" + team,
	    type: "GET",
	    crossDomain: true,
	    dataType: "json",
	    success: function (response) {
	        console.info('api success', response);
	        
	        $('#container').empty();

	        ReactDOM.render(
			    <Whiteboard title="Tolling Team Whiteboard" data={response} columns={columns[team]} />,
			    document.getElementById('container')
			);
	    },
	    error: function (xhr, status) {
	        console.error('api error', status);
	    }
	});
}

fetchAndDisplay();
setInterval(fetchAndDisplay, 60000);
