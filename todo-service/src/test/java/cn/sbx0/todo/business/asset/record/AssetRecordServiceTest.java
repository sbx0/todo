package cn.sbx0.todo.business.asset.record;

import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.exception.NoPermissionException;
import cn.sbx0.todo.repositories.AssetRecordRepository;
import cn.sbx0.todo.repositories.AssetTypeRepository;
import cn.sbx0.todo.service.common.Code;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    public void flow() {
        long userId = 1L;
        given(clientUserService.getLoginUserId()).willReturn(userId);
        List<AssetRecord> assetRecords = new ArrayList<>();
        assetRecords.add(AssetRecord.builder()
                .recordTime(LocalDateTime.now())
                .recordValue(new BigDecimal("10000"))
                .build());
        assetRecords.add(AssetRecord.builder()
                .recordTime(LocalDateTime.now())
                .recordValue(new BigDecimal("20000"))
                .build());
        assetRecords.add(AssetRecord.builder()
                .recordTime(LocalDateTime.now().minusDays(1))
                .recordValue(new BigDecimal("30000"))
                .build());
        given(repository.getRecordsByUser(userId)).willReturn(assetRecords);

        Result<List<AssetFlowRecord>> result = service.flow();
        assertNotNull(result);
        assertTrue(result.getSuccess());
        assertEquals(Code.SUCCESS, result.getCode());
        assertNotNull(result.getData());
        assertFalse(CollectionUtils.isEmpty(result.getData()));
        List<AssetFlowRecord> data = result.getData();
        assertEquals(2, data.size());
        AssetFlowRecord one = data.get(0);
        assertNotNull(one);
        assertEquals(new BigDecimal("30000"), one.getTotal());
        AssetFlowRecord two = data.get(1);
        assertNotNull(two);
        assertEquals(new BigDecimal("30000"), two.getTotal());
    }


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

    @Test
    public void updateBefore() {
        long userId = 1L;
        given(clientUserService.getLoginUserId()).willReturn(userId);
        AssetRecord fromInput = AssetRecord.builder()
                .id(1L)
                .userId(userId)
                .typeId(1L)
                .recordValue(new BigDecimal("11111"))
                .createTime(LocalDateTime.now())
                .build();
        AssetRecord result = service.updateBefore(fromInput);
        assertNotNull(result);
        assertNotNull(result.getUpdateTime());
        assertEquals(fromInput.getId(), result.getId());
        assertEquals(fromInput.getUserId(), result.getUserId());
        assertEquals(fromInput.getTypeId(), result.getTypeId());
        assertEquals(fromInput.getRecordValue(), result.getRecordValue());
        assertEquals(fromInput.getCreateTime(), result.getCreateTime());
    }

    @Test
    public void updateBeforeWithException() {
        long userId = 2L;
        given(clientUserService.getLoginUserId()).willReturn(userId);
        AssetRecord fromInput = AssetRecord.builder()
                .id(1L)
                .userId(1L)
                .typeId(1L)
                .recordValue(new BigDecimal("11111"))
                .createTime(LocalDateTime.now())
                .build();
        assertThrowsExactly(NoPermissionException.class, () -> service.updateBefore(fromInput));
    }

}
