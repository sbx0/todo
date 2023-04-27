package cn.sbx0.todo.business.asset.record;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @author sbx0
 * @since 2023/4/27
 */
@Getter
@Setter
@Builder
public class AssetFlowRecord {
    private String date;
    private LocalDateTime time;
    private BigDecimal total;
    private Long days;
    private BigDecimal growth;
    private BigDecimal growthRate;
    private List<AssetRecord> records;
}
