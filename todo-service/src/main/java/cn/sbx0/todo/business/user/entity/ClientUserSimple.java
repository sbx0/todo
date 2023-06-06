package cn.sbx0.todo.business.user.entity;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2023/6/6
 */
@Getter
@Setter
public class ClientUserSimple {
    private Long id;
    // nickname
    private String nickname;

    public ClientUserSimple() {
    }

    public ClientUserSimple(Long id, String nickname) {
        this.id = id;
        this.nickname = nickname;
    }
}
