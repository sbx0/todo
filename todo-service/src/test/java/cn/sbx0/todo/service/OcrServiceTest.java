package cn.sbx0.todo.service;

import jakarta.annotation.Resource;

import java.awt.*;
import java.io.File;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * @author sbx0
 * @since 2023/6/13
 */
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, classes = {OcrService.class})
class OcrServiceTest {
    @Resource
    private OcrService ocrService;

    //    @Test
    void scan() {
        String scan = ocrService.scan(
                new File("C:\\Users\\JsonSnow\\Pictures\\3e433cb78b56476fa027cd6dc6ae1fc.jpg"),
                new Rectangle(520, 240, 480, 200)
        );
        assertEquals("", scan);
    }
}