package cn.sbx0.todo.business.user.entity;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2023/3/15
 */
@Getter
@Setter
public class RegisterParam {
    private String email;
    private String password;
}
