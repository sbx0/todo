
package cn.sbx0.todo.business.time;

import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/15
 */
@RestController
@RequestMapping(("/time"))
public class TimeController {

  @Resource
  private TimeService service;

  /**
   * <p>All time</p>
   * <p>Unit Test is {@link  TimeControllerTest#now}</p>
   *
   * @return System Time and DB time
   */
  @GetMapping("/now")
  public Result<List<NowTime>> now() {
    return service.now();
  }

}
