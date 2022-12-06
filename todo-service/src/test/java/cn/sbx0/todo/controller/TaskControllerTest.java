package cn.sbx0.todo.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cn.sbx0.todo.entity.TaskEntity;
import cn.sbx0.todo.service.TaskServiceImpl;
import cn.sbx0.todo.service.common.Code;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Paging.PagingCommon;
import cn.sbx0.todo.service.common.Result;
import cn.sbx0.todo.utils.JSON;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.restdocs.RestDocumentationContextProvider;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * @author sbx0
 * @since 2022/12/2
 */
@Slf4j
@MockBean(classes = {TaskServiceImpl.class})
@ExtendWith({RestDocumentationExtension.class, SpringExtension.class})
@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
class TaskControllerTest {

  @Resource
  private TaskServiceImpl service;

  /**
   * Test for {@link TaskController#paging}
   *
   * @throws Exception exception
   */
  @Test
  void paging() throws Exception {
    int page = 1;
    int pageSize = 10;

    Paging<TaskEntity> pagingData = new Paging<>();
    pagingData.setSuccess(true);
    pagingData.setMessage(Code.SUCCESS_MESSAGE);

    List<TaskEntity> data = new ArrayList<>();
    TaskEntity test = new TaskEntity("Task Name");
    test.setId(1L);
    test.setTaskStatus(0);
    test.setTaskRemark("Task Remark");
    test.setPlanTime(LocalDateTime.now());
    test.setCreateTime(LocalDateTime.now());
    test.setUpdateTime(LocalDateTime.now());
    data.add(test);
    pagingData.setData(data);

    pagingData.setCode(Code.SUCCESS);

    pagingData.setCommon(new PagingCommon(page, pageSize, (long) data.size(), (long) page));

    given(service.paging(anyInt(), anyInt())).willReturn(pagingData);

    String response = mockMvc.perform(get("/task/paging")
            .accept(MediaType.APPLICATION_JSON)
            .queryParam("page", "1")
            .queryParam("pageSize", "10")
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("code").value("0"))
        .andDo(
            document("TaskPagingList",
                queryParameters(
                    parameterWithName("page").description("Page Number"),
                    parameterWithName("pageSize").description("Page Size")
                ),
                responseFields(
                    fieldWithPath("data[].id").description("ID"),
                    fieldWithPath("data[].taskName").description("Task Name"),
                    fieldWithPath("data[].taskRemark").description("Task Remark"),
                    fieldWithPath("data[].taskStatus").description("Task Status"),
                    fieldWithPath("data[].planTime").description("Plan Time"),
                    fieldWithPath("data[].createTime").description("Create Time"),
                    fieldWithPath("data[].updateTime").description("Update Time"),
                    fieldWithPath("data").description("Data"),
                    fieldWithPath("common.page").description("Page Number"),
                    fieldWithPath("common.pageSize").description("Page Size"),
                    fieldWithPath("common.total").description("Total"),
                    fieldWithPath("common.totalPage").description("Total Page"),
                    fieldWithPath("common").description("Common"),
                    fieldWithPath("success").description("Is success"),
                    fieldWithPath("code").description("Status Code"),
                    fieldWithPath("message").description("Message")
                )
            ))
        .andReturn().getResponse().getContentAsString();

    log.info(response);
  }

  /**
   * Test for {@link TaskController#save}
   *
   * @throws Exception exception
   */
  @Test
  void save() throws Exception {
    long id = 1L;
    TaskEntity test = new TaskEntity("Task Name");
    test.setId(id);
    test.setTaskStatus(0);
    test.setTaskRemark("Task Remark");
    test.setPlanTime(LocalDateTime.now());
    test.setCreateTime(LocalDateTime.now());
    test.setUpdateTime(LocalDateTime.now());

    given(service.save(any())).willReturn(Result.success(test));

    String response = mockMvc.perform(post("/task/save")
            .accept(MediaType.APPLICATION_JSON)
            .content(JSON.parse(test))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("code").value("0"))
        .andDo(
            document("TaskSave",
                requestFields(
                    fieldWithPath("id").description("ID"),
                    fieldWithPath("taskName").description("Task Name"),
                    fieldWithPath("taskRemark").description("Task Remark"),
                    fieldWithPath("taskStatus").description("Task Status"),
                    fieldWithPath("planTime").description("Plan Time"),
                    fieldWithPath("createTime").description("Create Time"),
                    fieldWithPath("updateTime").description("Update Time")
                ),
                responseFields(
                    fieldWithPath("data.id").description("ID"),
                    fieldWithPath("data.taskName").description("Task Name"),
                    fieldWithPath("data.taskRemark").description("Task Remark"),
                    fieldWithPath("data.taskStatus").description("Task Status"),
                    fieldWithPath("data.planTime").description("Plan Time"),
                    fieldWithPath("data.createTime").description("Create Time"),
                    fieldWithPath("data.updateTime").description("Update Time"),
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
