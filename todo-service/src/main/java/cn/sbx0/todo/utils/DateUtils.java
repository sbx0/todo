package cn.sbx0.todo.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

/**
 * @author sbx0
 * @since 2023/4/27
 */
public class DateUtils {
    public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static String format(LocalDateTime time) {
        return time.format(DATE_TIME_FORMATTER);
    }

    public static String formatDate(LocalDateTime time) {
        return time.format(DATE_FORMATTER);
    }

    public static Long between(LocalDateTime start, LocalDateTime end) {
        return ChronoUnit.DAYS.between(
                LocalDateTime.parse(start.format(DATE_FORMATTER) + " 00:00:00", DATE_TIME_FORMATTER),
                LocalDateTime.parse(end.format(DATE_FORMATTER) + " 00:00:00", DATE_TIME_FORMATTER)
        );
    }
}
