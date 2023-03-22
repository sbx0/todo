package cn.sbx0.todo.utils;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * @author sbx0
 * @since 2023/3/3
 */
public class CallApi {
    public static final HttpClient client = HttpClient.newHttpClient();

    public static String post(String host, String api, String body) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(host + api))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public static String get(String host, String api, Map<String, String> params) {
        // 构建请求 URI
        StringBuilder uriBuilder = new StringBuilder(host + api);
        if (params != null && !params.isEmpty()) {
            uriBuilder.append("?");
            for (Map.Entry<String, String> entry : params.entrySet()) {
                uriBuilder.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
                uriBuilder.append("=");
                uriBuilder.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
                uriBuilder.append("&");
            }
            uriBuilder.deleteCharAt(uriBuilder.length() - 1);
        }
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uriBuilder.toString()))
                .header("Content-Type", "application/json")
                .GET()
                .build();
        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
