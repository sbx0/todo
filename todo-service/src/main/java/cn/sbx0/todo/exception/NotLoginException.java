package cn.sbx0.todo.exception;

/**
 * @author sbx0
 * @since 2023/4/25
 */
public class NotLoginException extends RuntimeException {
    public NotLoginException(String message) {
        super(message);
    }
}
