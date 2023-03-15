package cn.sbx0.todo.business.time;

import cn.sbx0.todo.repositories.DualRepository;
import cn.sbx0.todo.service.common.Code;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.util.CollectionUtils;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@MockBean(classes = {DualRepository.class})
@SpringBootTest(webEnvironment = WebEnvironment.NONE, classes = {TimeService.class})
class TimeServiceTest {

    @Autowired
    private TimeService service;

    @Resource
    private DualRepository repository;

    @Test
    public void now() {
        given(repository.now()).willReturn(Timestamp.valueOf(LocalDateTime.now()));

        Result<List<NowTime>> result = service.now();
        assertNotNull(result);
        assertTrue(result.getSuccess());
        assertEquals(Code.SUCCESS, result.getCode());

        List<NowTime> data = result.getData();
        assertNotNull(data);
        assertFalse(CollectionUtils.isEmpty(data));
        assertEquals(2, data.size());
    }

}
