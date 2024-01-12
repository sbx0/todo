package cn.sbx0.todo.business.file;

public enum FileEncryptionType {
    // 未加密
    NONE(0),
    // 简单加密
    SIMPLE(1),
    // 点对点加密
    POINT_TO_POINT(2);

    private final int value;

    FileEncryptionType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
