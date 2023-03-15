package cn.sbx0.todo.service;

import cn.sbx0.todo.business.category.CategoryEntity;
import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * @author sbx0
 * @since 2023/3/15
 */
public abstract class JpaServiceImpl<R extends JpaRepository<T, ID>, T, ID> {
    @Resource
    protected R r;

    protected abstract ID getId(T t);

    protected abstract T saveBefore(T t);

    public <DefaultPagingRequest extends PagingRequest> Paging<T> paging(DefaultPagingRequest pagingRequest) {
        Page<T> pagingData = r.findAll(Paging.build(pagingRequest.getPage(), pagingRequest.getPageSize()));
        return Paging.success(
                pagingData.getContent(),
                pagingData.getPageable().getPageNumber(),
                pagingData.getPageable().getPageSize(),
                pagingData.getTotalElements(),
                pagingData.getTotalPages()
        );
    }

    @Transactional(rollbackFor = Exception.class)
    public Result<T> save(T entity) {
        if (entity == null) {
            return Result.failed();
        }
        entity = r.save(saveBefore(entity));
        if (getId(entity) != null) {
            return Result.success(entity);
        } else {
            return Result.failed();
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public Result<T> update(T entity) {
        if (entity == null || getId(entity) == null) {
            return Result.failed();
        }
        r.save(entity);
        return Result.success(entity);
    }

    public Result<T> findById(ID id) {
        Optional<T> result = r.findById(id);
        return result.map(Result::success).orElseGet(Result::failed);
    }

    public Result<Void> deleteById(ID id) {
        r.deleteById(id);
        return Result.success();
    }
}
