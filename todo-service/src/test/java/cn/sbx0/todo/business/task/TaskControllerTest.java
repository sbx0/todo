package cn.sbx0.todo.business.task;

import cn.sbx0.todo.business.task.entity.TaskEntity;
import cn.sbx0.todo.business.task.entity.TaskPagingRequest;
import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.config.SpringSecurityConfig;
import cn.sbx0.todo.entity.OrderRequest;
import cn.sbx0.todo.entity.StatisticalIndicators;
import cn.sbx0.todo.service.common.Code;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Paging.PagingCommon;
import cn.sbx0.todo.service.common.Result;
import cn.sbx0.todo.utils.JSON;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.restdocs.RestDocumentationContextProvider;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.sql.DataSource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author sbx0
 * @since 2022/12/2
 */
@Slf4j
@MockBean(classes = {TaskService.class, ClientUserService.class, DataSource.class})
@WebMvcTest({TaskController.class})
@ExtendWith({RestDocumentationExtension.class})
@Import(SpringSecurityConfig.class)
class TaskControllerTest {

    protected MockMvc mockMvc;
    @Resource
    private TaskService service;
    @Resource
    private ClientUserService userService;

    /**
     * Test for {@link TaskController#statistics}
     *
     * @throws Exception exception
     */
    @Test
    void statistics() throws Exception {
        List<StatisticalIndicators> list = new ArrayList<>();
        // completed
        StatisticalIndicators completed = new StatisticalIndicators();
        completed.setKey("completed");
        completed.setName("Completed");
        completed.setValue(1L);
        list.add(completed);
        // uncompleted
        StatisticalIndicators uncompleted = new StatisticalIndicators();
        uncompleted.setKey("uncompleted");
        uncompleted.setName("Uncompleted");
        uncompleted.setValue(2L);
        list.add(uncompleted);
        given(service.statistics(anyLong())).willReturn(Result.success(list));

        String response = mockMvc.perform(get("/task/statistics")
                        .accept(MediaType.APPLICATION_JSON)
                        .queryParam("categoryId", "0")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("code").value("0"))
                .andDo(
                        document("TaskStatistics",
                                queryParameters(
                                        parameterWithName("categoryId").description("Category Id")
                                ),
                                responseFields(
                                        fieldWithPath("data[].key").description("Statistics Key"),
                                        fieldWithPath("data[].name").description("Statistics Name"),
                                        fieldWithPath("data[].value").description("Statistics Value"),
                                        fieldWithPath("data").description("Data"),
                                        fieldWithPath("success").description("Is success"),
                                        fieldWithPath("code").description("Status Code"),
                                        fieldWithPath("message").description("Message")
                                )
                        ))
                .andReturn().getResponse().getContentAsString();

        log.info(response);
    }

    /**
     * Test for {@link TaskController#paging}
     *
     * @throws Exception exception
     */
    @Test
    void paging() throws Exception {
        TaskPagingRequest pagingRequest = new TaskPagingRequest(1, 10);
        pagingRequest.setCategoryId(1L);
        pagingRequest.setOrders(List.of(new OrderRequest("id", "desc")));

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

        pagingData.setCommon(
                new PagingCommon(
                        pagingRequest.getPage(),
                        pagingRequest.getPageSize(),
                        (long) data.size(),
                        (long) pagingRequest.getPage()
                )
        );

        given(service.paging(any())).willReturn(pagingData);
        given(userService.getUserId(any())).willReturn(1L);

        String response = mockMvc.perform(post("/task/paging")
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(JSON.parse(pagingRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("code").value("0"))
                .andDo(
                        document("TaskPagingList",
                                requestFields(
                                        fieldWithPath("categoryId").description("Category Id"),
                                        fieldWithPath("taskStatus").description("Task Status"),
                                        fieldWithPath("userId").description("User Id"),
                                        fieldWithPath("page").description("Page Number"),
                                        fieldWithPath("pageSize").description("Page Size"),
                                        fieldWithPath("orders").description("Orders"),
                                        fieldWithPath("orders[].name").description("Order Name"),
                                        fieldWithPath("orders[].direction").description("Order Direction")
                                ),
                                responseFields(
                                        fieldWithPath("data[].id").description("ID"),
                                        fieldWithPath("data[].userId").description("User ID"),
                                        fieldWithPath("data[].taskName").description("Task Name"),
                                        fieldWithPath("data[].taskRemark").description("Task Remark"),
                                        fieldWithPath("data[].taskStatus").description("Task Status"),
                                        fieldWithPath("data[].planTime").description("Plan Time"),
                                        fieldWithPath("data[].categoryId").description("Category Id"),
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
                                        fieldWithPath("userId").description("User ID"),
                                        fieldWithPath("taskName").description("Task Name"),
                                        fieldWithPath("taskRemark").description("Task Remark"),
                                        fieldWithPath("taskStatus").description("Task Status"),
                                        fieldWithPath("planTime").description("Plan Time"),
                                        fieldWithPath("categoryId").description("Category Id"),
                                        fieldWithPath("createTime").description("Create Time"),
                                        fieldWithPath("updateTime").description("Update Time")
                                ),
                                responseFields(
                                        fieldWithPath("data.id").description("ID"),
                                        fieldWithPath("data.userId").description("User ID"),
                                        fieldWithPath("data.taskName").description("Task Name"),
                                        fieldWithPath("data.taskRemark").description("Task Remark"),
                                        fieldWithPath("data.taskStatus").description("Task Status"),
                                        fieldWithPath("data.planTime").description("Plan Time"),
                                        fieldWithPath("data.categoryId").description("Category Id"),
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

    /**
     * Test for {@link TaskController#update}
     *
     * @throws Exception exception
     */
    @Test
    void update() throws Exception {
        long id = 1L;
        TaskEntity test = new TaskEntity("Task Name");
        test.setId(id);
        test.setTaskStatus(0);
        test.setTaskRemark("Task Remark");
        test.setPlanTime(LocalDateTime.now());
        test.setCreateTime(LocalDateTime.now());
        test.setUpdateTime(LocalDateTime.now());

        given(service.update(any())).willReturn(Result.success(test));

        String response = mockMvc.perform(post("/task/update")
                        .accept(MediaType.APPLICATION_JSON)
                        .content(JSON.parse(test))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("code").value("0"))
                .andDo(
                        document("TaskUpdate",
                                requestFields(
                                        fieldWithPath("id").description("ID"),
                                        fieldWithPath("userId").description("User ID"),
                                        fieldWithPath("taskName").description("Task Name"),
                                        fieldWithPath("taskRemark").description("Task Remark"),
                                        fieldWithPath("taskStatus").description("Task Status"),
                                        fieldWithPath("planTime").description("Plan Time"),
                                        fieldWithPath("categoryId").description("Category Id"),
                                        fieldWithPath("createTime").description("Create Time"),
                                        fieldWithPath("updateTime").description("Update Time")
                                ),
                                responseFields(
                                        fieldWithPath("data.id").description("ID"),
                                        fieldWithPath("data.userId").description("User ID"),
                                        fieldWithPath("data.taskName").description("Task Name"),
                                        fieldWithPath("data.taskRemark").description("Task Remark"),
                                        fieldWithPath("data.taskStatus").description("Task Status"),
                                        fieldWithPath("data.planTime").description("Plan Time"),
                                        fieldWithPath("data.categoryId").description("Category Id"),
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
