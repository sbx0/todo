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
    result.setCode(Code.SUCCESS);
    result.setSuccess(true);
    return result;
  }

  public static <T> Result<T> success(T data) {
    Result<T> result = new Result<>();
    result.setCode(Code.SUCCESS);
    result.setSuccess(true);
    result.setData(data);
    return result;
  }

  public static <T> Result<T> failed() {
    Result<T> result = new Result<>();
    result.setCode(Code.FAILED);
    result.setSuccess(false);
    return result;
  }

  public static <T> Result<T> failed(T data) {
    Result<T> result = new Result<>();
    result.setCode(Code.FAILED);
    result.setSuccess(false);
    result.setData(data);
    return result;
  }
}
