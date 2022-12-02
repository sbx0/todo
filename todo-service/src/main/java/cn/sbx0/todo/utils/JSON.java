package cn.sbx0.todo.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

/**
 * @author sbx0
 * @since 2022/12/2
 */
@Slf4j
public class JSON {

  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
  private static final String EMPTY = "{\"code\":1,\"success\":false,\"message\":\"JSON parse error\"}";

  static {
    OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  }

  public static String parse(Object o) {
    try {
      return OBJECT_MAPPER.writeValueAsString(o);
    } catch (JsonProcessingException e) {
      log.error(e.getMessage(), e);
    }
    return EMPTY;
  }

  public static JavaType getCollectionType(Class<?> collectionClass, Class<?>... elementClasses) {
    return OBJECT_MAPPER.getTypeFactory().constructParametricType(collectionClass, elementClasses);
  }

}
