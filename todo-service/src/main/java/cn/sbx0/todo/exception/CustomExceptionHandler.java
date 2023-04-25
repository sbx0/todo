package cn.sbx0.todo.exception;

import cn.sbx0.todo.service.common.Result;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author sbx0
 * @since 2023/4/25
 */
@ControllerAdvice
public class CustomExceptionHandler {

    @ResponseBody
    @ExceptionHandler(value = Exception.class)
    public Result<String> handleException(Exception e) {
        e.printStackTrace();
        return Result.failure("System Error");
    }

    @ResponseBody
    @ExceptionHandler(value = NoPermissionException.class)
    public Result<String> handleNoPermissionException(Exception e) {
        e.printStackTrace();
        return Result.failure("No Permission");
    }

    @ResponseBody
    @ExceptionHandler(value = NotLoginException.class)
    public Result<String> handleNotLoginException(Exception e) {
        e.printStackTrace();
        return Result.failure("Not Login");
    }

    @ResponseBody
    @ExceptionHandler(value = UserNotExistException.class)
    public Result<String> handleUserNotExistException(Exception e) {
        e.printStackTrace();
        return Result.failure("User Not Exist");
    }

}
