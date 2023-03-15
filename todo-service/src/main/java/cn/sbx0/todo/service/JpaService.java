package cn.sbx0.todo.service;

import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * @author sbx0
 * @since 2023/3/15
 */
public abstract class JpaService<R extends JpaRepository<T, ID>, T, ID> {
    protected abstract R repository();

    protected abstract ID getId(T t);

    protected abstract T saveBefore(T t);

    public <DefaultPagingRequest extends PagingRequest> Paging<T> paging(DefaultPagingRequest pagingRequest) {
        Page<T> pagingData = repository().findAll(Paging.build(
                pagingRequest.getPage(), pagingRequest.getPageSize(),
                Sort.by(Sort.Order.asc("id"))
        ));
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
        entity = repository().save(saveBefore(entity));
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
        repository().save(entity);
        return Result.success(entity);
    }

    public Result<T> findById(ID id) {
        Optional<T> result = repository().findById(id);
        return result.map(Result::success).orElseGet(Result::failed);
    }

    public Result<Void> deleteById(ID id) {
        repository().deleteById(id);
        return Result.success();
    }
}
