package cn.sbx0.todo.business.time;

import cn.sbx0.todo.business.task.TaskController;
import cn.sbx0.todo.config.RestConfig;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.restdocs.RestDocumentationContextProvider;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;

import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@MockBean(classes = {TimeService.class})
@WebMvcTest({TimeController.class})
@ExtendWith({RestDocumentationExtension.class})
@Import(RestConfig.class)
class TimeControllerTest {

  @Resource
  private TimeService service;

  /**
   * Test for {@link TimeController#now}
   *
   * @throws Exception exception
   */
  @Test
  void paging() throws Exception {
    ArrayList<NowTime> list = new ArrayList<>();
    // system time
    list.add(new NowTime("system", LocalDateTime.now()));
    // db time
    list.add(new NowTime("db", Instant.ofEpochMilli(11111111).atZone(ZoneId.systemDefault()).toLocalDateTime()));

    given(service.now()).willReturn(Result.success(list));

    String response = mockMvc.perform(get("/time/now")
                    .accept(MediaType.APPLICATION_JSON)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("code").value("0"))
            .andDo(
                    document("TimeNow",
                            responseFields(
                                    fieldWithPath("data[].kind").description("Time Kind"),
                                    fieldWithPath("data[].time").description("Now Time"),
                                    fieldWithPath("data").description("Data"),
                                    fieldWithPath("success").description("Is success"),
                                    fieldWithPath("code").description("Status Code"),
                                    fieldWithPath("message").description("Message")
                            )
                    ))
            .andReturn().getResponse().getContentAsString();

    log.info(response);
  }

  protected MockMvc mockMvc;

  @BeforeEach
  public void setUp(
          WebApplicationContext webApplicationContext,
          RestDocumentationContextProvider restDocumentation
  ) {
    this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
            .apply(
                    documentationConfiguration(restDocumentation)
                            .uris().withScheme("http").withHost("127.0.0.1").withPort(9999)
                            .and()
                            .operationPreprocessors()
                            .withRequestDefaults(prettyPrint())
                            .withResponseDefaults(prettyPrint())
            )
            .build();
  }
}
