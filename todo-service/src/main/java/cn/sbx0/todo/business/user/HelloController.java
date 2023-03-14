package cn.sbx0.todo.business.user;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author sbx0
 * @since 2023/3/14
 */
@RestController
public class HelloController {

    @GetMapping("/")
    public String hello(Authentication authentication) {
        return "Hello, " + authentication.getName() + "!";
    }

}