package hello.controller;

import hello.entity.Greeting;
import hello.entity.HelloMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
public class GreetingController {

    /* 消息发送到前端的工具 */
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public GreetingController(SimpMessagingTemplate simpMessagingTemplate) {
        this.messagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/hello")//前端送信地址（注意前缀，常见前缀"/app"）
    @SendTo("/topic/greetings")//（有返回值和return时，映射此地址）前端订阅地址，后端消息由此地址送出
    public void greeting(HelloMessage message) throws Exception {
        messagingTemplate.convertAndSend("/topic/greetings",new Greeting("Hello, " + message.getName() + "!"));
        messagingTemplate.convertAndSend("/topic/secret",new Greeting("Hello, " + message.getName() + "! (secret)"));
    }

}