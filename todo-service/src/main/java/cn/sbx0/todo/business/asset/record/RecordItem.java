package cn.sbx0.todo.business.asset.record;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author sbx0
 * @since 2023/1/11
 */
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordItem {
    private String name;
    private String type;
    private String stack;
    private Integer yAxisIndex;
    private Boolean smooth;
    private Boolean showSymbol;
    private List<BigDecimal> data;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStack() {
        return stack;
    }

    public void setStack(String stack) {
        this.stack = stack;
    }

    public Integer getyAxisIndex() {
        return yAxisIndex;
    }

    public void setyAxisIndex(Integer yAxisIndex) {
        this.yAxisIndex = yAxisIndex;
    }

    public Boolean getSmooth() {
        return smooth;
    }

    public void setSmooth(Boolean smooth) {
        this.smooth = smooth;
    }

    public Boolean getShowSymbol() {
        return showSymbol;
    }

    public void setShowSymbol(Boolean showSymbol) {
        this.showSymbol = showSymbol;
    }

    public List<BigDecimal> getData() {
        return data;
    }

    public void setData(List<BigDecimal> data) {
        this.data = data;
    }
}
