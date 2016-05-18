package nz.co.eroad.utils;
 
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.print.attribute.standard.Media;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
 
@Path("/")
public class JiraWebService {
	InputStream inputStream;
	Properties properties;
	
	@GET
	@Path("/jiraService/{teamName}")
	@Produces("application/json")
//	@Consumes(MediaType.APPLICATION_JSON)
	public Response whiteBoardREST(
			@PathParam("teamName") String teamName
		) throws JSONException, IOException {
		Map<String, String> teams_jql = getJqlMap();
		
		ExecutorService executor = Executors.newFixedThreadPool(1);
		String apiUrl = "https://jira.eroad.io/rest/api/2/search?jql=" + URLEncoder.encode(teams_jql.get(teamName), "UTF-8");
		Future<JiraResponse> response = executor.submit(new JiraRequest(new URL(apiUrl)));
		InputStream body;
		try {
			body = response.get().getBody();
		} catch (InterruptedException | ExecutionException e) {
			e.printStackTrace();
			return Response.status(500).entity("error").build();
		}
		executor.shutdown();
		
		StringWriter stringWriter = new StringWriter();
		IOUtils.copy(body, stringWriter);
		String responseString = stringWriter.toString();
 
		// return HTTP response 200 in case of success
		return Response.status(200).entity(responseString).build();
	}
 
	@GET
	@Path("/verify")
	@Produces(MediaType.TEXT_PLAIN)
	public Response verifyRESTService() {
		String result = "JiraWebService Successfully started..";
 
		// return HTTP response 200 in case of success
		return Response.status(200).entity(result).build();
	}
	
	private Map<String, String> getJqlMap() {
		// TODO: get this information from a configuration file, database or other storage service
		Map<String, String> map = new HashMap<String, String>();
		map.put("tolling", "Sprint = 523 AND project in (IRP, RUC, \"IF\", WMT, FTX, JNY) ORDER BY Rank ASC");
		map.put("ca", "Sprint = 507 AND project = CA ORDER BY Rank ASC");
		map.put("gen2", "Sprint = 515 AND project = \"Gen 2 OBU\" AND labels = drivebuddy OR labels = Gen2Settings OR labels = NzApproval OR labels = Gen2Feature ORDER BY Rank ASC");
		map.put("platform", "Sprint = 477 AND project = Platform AND NOT (issuetype = Epic AND status in (Open, Reopened)) ORDER BY Rank ASC");
		map.put("best", "Sprint = 474 AND project in (BEST) OR project in (BUR, \"INT\") AND labels = CustomerLifecycle ORDER BY Rank ASC");
		map.put("driver", "Sprint = 486 AND project = ED ORDER BY Rank ASC");
		map.put("aeon", "Sprint = 546 AND project = ED ORDER BY Rank ASC");
		
		return map;
	}
 
}