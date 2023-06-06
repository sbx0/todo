package cn.sbx0.todo.business.task.entity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

/**
 * @author sbx0
 * @since 2023/6/6
 */
@Mapper
public interface TaskMapper {
    TaskMapper INSTANCE = Mappers.getMapper(TaskMapper.class);

    @Mapping(target = ".", source = "task")
    @Mapping(target = "userName", source = "userName")
    @Mapping(target = "categoryName", source = "categoryName")
    TaskView toView(TaskEntity task, String userName, String categoryName);
}
