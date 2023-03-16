package cn.sbx0.todo.service.common;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Getter
@Setter
public class Result<T> {

    private Integer code;
    private Boolean success;
    private String message;

    private T data;

    public static <T> Result<T> success() {
        Result<T> result = new Result<>();
        result.setSuccess(true);
        result.setCode(Code.SUCCESS);
        result.setMessage(Code.SUCCESS_MESSAGE);
        return result;
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setSuccess(true);
        result.setCode(Code.SUCCESS);
        result.setMessage(Code.SUCCESS_MESSAGE);
        result.setData(data);
        return result;
    }

    public static <T> Result<T> failure() {
        Result<T> result = new Result<>();
        result.setSuccess(false);
        result.setCode(Code.FAILED);
        result.setMessage(Code.FAILED_MESSAGE);
        return result;
    }

    public static <T> Result<T> failure(String message) {
        Result<T> result = new Result<>();
        result.setSuccess(false);
        result.setCode(Code.FAILED);
        result.setMessage(message);
        result.setData(null);
        return result;
    }

    public Boolean isSuccess() {
        return this.success;
    }
}
