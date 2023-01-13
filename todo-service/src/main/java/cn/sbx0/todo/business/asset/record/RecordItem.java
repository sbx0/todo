package cn.sbx0.todo.business.asset.record;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author sbx0
 * @since 2023/1/11
 */
@Getter
@Setter
public class RecordItem {
    private String name;
    private String type;
    private String stack;
    private Integer yAxisIndex;
    private Boolean smooth;
    private Boolean showSymbol;
    private List<BigDecimal> data;
}
