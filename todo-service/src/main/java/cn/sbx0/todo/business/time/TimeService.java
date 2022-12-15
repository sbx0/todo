package cn.sbx0.todo.business.time;

import cn.sbx0.todo.repositories.DualRepository;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/15
 */
@Slf4j
@Service
public class TimeService {
    @Resource
    private DualRepository repository;

    public Result<List<NowTime>> now() {
        ArrayList<NowTime> list = new ArrayList<>();
        // system time
        list.add(new NowTime("system", LocalDateTime.now()));
        // db time
        list.add(new NowTime("db", Instant.ofEpochMilli(repository.now().getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime()));
        return Result.success(list);
    }
}
