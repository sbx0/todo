package cn.sbx0.todo.exception;

/**
 * @author sbx0
 * @since 2023/4/25
 */
public class UserNotExistException extends RuntimeException {
    public UserNotExistException(String message) {
        super(message);
    }
}
