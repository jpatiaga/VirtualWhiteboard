package nz.co.eroad.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Callable;

import com.sun.jersey.core.util.Base64;

public class JiraRequest implements Callable<JiraResponse> {
	private URL url;
	
	public JiraRequest(URL url) {
		this.url = url;
	}

	@Override
	public JiraResponse call() throws Exception {
		HttpURLConnection urlConnection = (HttpURLConnection)url.openConnection();
		String basicAuth = "Basic anVhbi5hdGlhZ2E6anBOWjg5Nzgh";
		urlConnection.setReadTimeout(60 * 1000);
		urlConnection.setConnectTimeout(60 * 1000);
		urlConnection.setRequestProperty("Authorization", basicAuth);
		urlConnection.setRequestMethod("GET");
		
		return new JiraResponse(urlConnection.getInputStream());
	}

}
