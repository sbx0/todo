package cn.sbx0.todo.business.category;

import cn.sbx0.todo.config.SpringSecurityConfig;
import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.entity.OrderRequest;
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
import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@MockBean(classes = {CategoryService.class, DataSource.class, SpringSecurityConfig.class})
@WebMvcTest({CategoryController.class})
@ExtendWith({RestDocumentationExtension.class})
class CategoryControllerTest {

    protected MockMvc mockMvc;
    @Resource
    private CategoryService service;

    /**
     * Test for {@link CategoryController#paging}
     *
     * @throws Exception exception
     */
    @Test
    void paging() throws Exception {
        DefaultPagingRequest pagingRequest = new DefaultPagingRequest(1, 10);
        pagingRequest.setOrders(List.of(new OrderRequest("id", "desc")));

        Paging<CategoryEntity> pagingData = new Paging<>();
        pagingData.setSuccess(true);
        pagingData.setMessage(Code.SUCCESS_MESSAGE);

        List<CategoryEntity> data = new ArrayList<>();
        CategoryEntity test = new CategoryEntity("Category Name");
        test.setId(1L);
        test.setCategoryRemark("Category Remark");
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

        String response = mockMvc.perform(post("/category/paging")
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(JSON.parse(pagingRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("code").value("0"))
                .andDo(
                        document("CategoryPagingList",
                                requestFields(
                                        fieldWithPath("page").description("Page Number"),
                                        fieldWithPath("pageSize").description("Page Size"),
                                        fieldWithPath("orders").description("Orders"),
                                        fieldWithPath("orders[].name").description("Order Name"),
                                        fieldWithPath("orders[].direction").description("Order Direction")
                                ),
                                responseFields(
                                        fieldWithPath("data[].id").description("ID"),
                                        fieldWithPath("data[].userId").description("User ID"),
                                        fieldWithPath("data[].categoryName").description("Category Name"),
                                        fieldWithPath("data[].categoryRemark").description("Category Remark"),
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
     * Test for {@link CategoryController#save}
     *
     * @throws Exception exception
     */
    @Test
    void save() throws Exception {
        long id = 1L;
        CategoryEntity test = new CategoryEntity("Category Name");
        test.setId(id);
        test.setCategoryRemark("Category Remark");
        test.setCreateTime(LocalDateTime.now());
        test.setUpdateTime(LocalDateTime.now());

        given(service.save(any())).willReturn(Result.success(test));

        String response = mockMvc.perform(post("/category/save")
                        .accept(MediaType.APPLICATION_JSON)
                        .content(JSON.parse(test))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("code").value("0"))
                .andDo(
                        document("CategorySave",
                                requestFields(
                                        fieldWithPath("id").description("ID"),
                                        fieldWithPath("userId").description("User ID"),
                                        fieldWithPath("categoryName").description("Category Name"),
                                        fieldWithPath("categoryRemark").description("Category Remark"),
                                        fieldWithPath("createTime").description("Create Time"),
                                        fieldWithPath("updateTime").description("Update Time")
                                ),
                                responseFields(
                                        fieldWithPath("data.id").description("ID"),
                                        fieldWithPath("data.userId").description("User ID"),
                                        fieldWithPath("data.categoryName").description("Category Name"),
                                        fieldWithPath("data.categoryRemark").description("Category Remark"),
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
     * Test for {@link CategoryController#update}
     *
     * @throws Exception exception
     */
    @Test
    void update() throws Exception {
        long id = 1L;
        CategoryEntity test = new CategoryEntity("Category Name");
        test.setId(id);
        test.setCategoryRemark("Category Remark");
        test.setCreateTime(LocalDateTime.now());
        test.setUpdateTime(LocalDateTime.now());

        given(service.update(any())).willReturn(Result.success(test));

        String response = mockMvc.perform(post("/category/update")
                        .accept(MediaType.APPLICATION_JSON)
                        .content(JSON.parse(test))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("code").value("0"))
                .andDo(
                        document("CategoryUpdate",
                                requestFields(
                                        fieldWithPath("id").description("ID"),
                                        fieldWithPath("categoryName").description("Category Name"),
                                        fieldWithPath("userId").description("User ID"),
                                        fieldWithPath("categoryRemark").description("Category Remark"),
                                        fieldWithPath("createTime").description("Create Time"),
                                        fieldWithPath("updateTime").description("Update Time")
                                ),
                                responseFields(
                                        fieldWithPath("data.id").description("ID"),
                                        fieldWithPath("data.userId").description("User ID"),
                                        fieldWithPath("data.categoryName").description("Category Name"),
                                        fieldWithPath("data.categoryRemark").description("Category Remark"),
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
