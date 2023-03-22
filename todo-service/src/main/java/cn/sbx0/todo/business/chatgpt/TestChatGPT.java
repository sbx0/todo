package cn.sbx0.todo.business.chatgpt;

import com.plexpt.chatgpt.ChatGPT;
import com.plexpt.chatgpt.util.Proxys;

import java.net.Proxy;

/**
 * @author sbx0
 * @since 2023/3/21
 */
public class TestChatGPT {
    public static void main(String[] args) {
        Proxy proxy = Proxys.http("127.0.0.1", 11112);

        ChatGPT chatGPT = ChatGPT.builder()
                .apiKey("")
                .proxy(proxy)
                .apiHost("https://api.openai.com/") //反向代理地址
                .build()
                .init();

        String res = chatGPT.chat("写一段七言绝句诗，题目是：火锅！");
        System.out.println(res);
    }
}
