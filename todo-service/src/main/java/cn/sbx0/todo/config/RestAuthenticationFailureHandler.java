package cn.sbx0.todo.config;

import cn.sbx0.todo.service.common.Result;
import cn.sbx0.todo.utils.JSON;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * @author sbx0
 * @since 2023/4/18
 */
@Component
public class RestAuthenticationFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        if (exception instanceof BadCredentialsException) {
            response.getWriter().println(JSON.parse(Result.failure("用户名或密码错误")));
        } else {
            response.getWriter().println(JSON.parse(Result.failure("登录失败")));
        }
    }
}
