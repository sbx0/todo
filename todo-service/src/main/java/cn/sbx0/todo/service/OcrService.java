package cn.sbx0.todo.service;

import lombok.extern.slf4j.Slf4j;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.File;

/**
 * @author sbx0
 * @since 2023/6/13
 */
@Slf4j
@Service
public class OcrService {
    public static final String EMPTY = "";
    public static Tesseract tesseract = null;
    @Value("${ocr.language}")
    private String language;
    @Value("${ocr.data-path}")
    private String dataPath;

    public OcrService() {
        tesseract = new Tesseract();
        tesseract.setLanguage(language);
        tesseract.setDatapath(dataPath);
    }

    public String scan(File file, Rectangle rectangle) {
        try {
            return tesseract.doOCR(file, rectangle);
        } catch (TesseractException e) {
            log.error(e.getMessage());
        }
        return EMPTY;
    }

    public String scan(File file) {

        try {
            return tesseract.doOCR(file);
        } catch (TesseractException e) {
            log.error(e.getMessage());
        }
        return EMPTY;
    }
}
