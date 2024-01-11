package cn.sbx0.todo.business.file;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileInfoEntity {
    private String fileName;
    private String originalFileName;
    private String md5;
}
