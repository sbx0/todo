package cn.sbx0.todo.business.user.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2023/3/20
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomUser extends DefaultUser {
    private Long id;

    public CustomUser(DefaultUser defaultUser, Long id) {
        super(defaultUser.getUsername(),
                defaultUser.getPassword(),
                defaultUser.getEnabled());
        this.id = id;
    }
}
