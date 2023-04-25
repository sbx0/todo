package cn.sbx0.todo.business.asset.record;

import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.repositories.AssetRecordRepository;
import cn.sbx0.todo.repositories.AssetTypeRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;

/**
 * @author sbx0
 * @since 2023/4/25
 */
@MockBean(classes = {AssetRecordRepository.class, AssetTypeRepository.class, ClientUserService.class})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, classes = {AssetRecordService.class})
class AssetRecordServiceTest {
    @Resource
    private AssetRecordService service;
    @Resource
    private AssetRecordRepository repository;
    @Resource
    private AssetTypeRepository assetTypeRepository;
    @Resource
    private ClientUserService clientUserService;


    @Test
    public void saveBeforeWhenExist() {
        long userId = 1L;
        given(clientUserService.getLoginUserId()).willReturn(userId);

        AssetRecord fromDb = AssetRecord.builder()
                .id(1L)
                .userId(1L)
                .typeId(1L)
                .recordValue(new BigDecimal("22222"))
                .build();
        given(repository.findByTypeIdAndRecordTime(any(), anyLong())).willReturn(fromDb);

        AssetRecord fromInput = AssetRecord.builder()
                .userId(2L)
                .typeId(1L)
                .recordValue(new BigDecimal("11111"))
                .build();

        AssetRecord result = service.saveBefore(fromInput);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals(fromDb.getId(), result.getId());
        assertEquals(userId, result.getUserId());
        assertEquals(fromInput.getRecordValue(), result.getRecordValue());
    }

    @Test
    public void saveBeforeWhenNotExist() {
        long userId = 1L;
        given(clientUserService.getLoginUserId()).willReturn(userId);

        given(repository.findByTypeIdAndRecordTime(any(), anyLong())).willReturn(null);

        AssetRecord fromInput = AssetRecord.builder()
                .userId(2L)
                .typeId(1L)
                .recordValue(new BigDecimal("11111"))
                .build();

        AssetRecord result = service.saveBefore(fromInput);

        assertNotNull(result);
        assertNull(result.getId());
        assertNotNull(result.getCreateTime());
        assertEquals(userId, result.getUserId());
        assertEquals(fromInput.getRecordValue(), result.getRecordValue());
    }

}
