package cn.sbx0.todo.business.category;

import cn.sbx0.todo.business.asset.record.AssetRecordController;
import cn.sbx0.todo.business.asset.record.AssetRecordService;
import cn.sbx0.todo.business.asset.record.RecordItem;
import cn.sbx0.todo.config.SpringSecurityConfig;
import cn.sbx0.todo.service.common.Result;
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
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
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
@MockBean(classes = {AssetRecordService.class, DataSource.class, SpringSecurityConfig.class})
@WebMvcTest({AssetRecordController.class})
@ExtendWith({RestDocumentationExtension.class})
class AssetRecordControllerTest {

    protected MockMvc mockMvc;
    @Resource
    private AssetRecordService service;

    @Test
    public void buildDataForEChart() throws Exception {
        List<RecordItem> list = new ArrayList<>();
        list.add(RecordItem.builder()
                .name("Total")
                .type("line")
                .stack("Total")
                .yAxisIndex(0)
                .smooth(false)
                .showSymbol(false)
                .build());

        given(service.buildDataForEChart()).willReturn(Result.success(list));

        String response = mockMvc.perform(get("/asset/record/getRecords")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("code").value("0"))
                .andDo(
                        document("AssetRecordList",
                                responseFields(
                                        fieldWithPath("data[].name").description("Name"),
                                        fieldWithPath("data[].type").description("Type"),
                                        fieldWithPath("data[].stack").description("Stack"),
                                        fieldWithPath("data[].yAxisIndex").description("YAxisIndex"),
                                        fieldWithPath("data[].smooth").description("Smooth"),
                                        fieldWithPath("data[].showSymbol").description("ShowSymbol"),
                                        fieldWithPath("data[].data").description("Real Data"),
                                        fieldWithPath("data").description("Data"),
                                        fieldWithPath("success").description("Is success"),
                                        fieldWithPath("code").description("Status Code"),
                                        fieldWithPath("message").description("Message")
                                )
                        ))
                .andReturn().getResponse().getContentAsString();

        assertNotNull(response);
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
