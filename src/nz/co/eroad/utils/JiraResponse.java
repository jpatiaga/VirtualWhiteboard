package nz.co.eroad.utils;

import java.io.InputStream;

public class JiraResponse {
	private InputStream body;
	
	public JiraResponse(InputStream body) {
		this.body = body;
	}
	
	public InputStream getBody() {
		return body;
	}
	
}
