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
public abstract class JpaService<R extends JpaRepository<T, ID>, T, ID, DefaultPagingRequest extends PagingRequest> {
    protected abstract R repository();

    protected abstract ID getId(T t);

    protected abstract T saveBefore(T t);

    protected abstract T updateBefore(T t);

    public Paging<T> paging(DefaultPagingRequest pagingRequest) {
        Page<T> pagingData = repository().findAll(Paging.build(
                pagingRequest.getPage(), pagingRequest.getPageSize(),
                Sort.by(Sort.Order.asc("id"))
        ));
        return Paging.success(
                pagingData.getContent(),
                pagingData.getPageable().getPageNumber() + 1,
                pagingData.getPageable().getPageSize(),
                pagingData.getTotalElements(),
                pagingData.getTotalPages()
        );
    }

    @Transactional(rollbackFor = Exception.class)
    public Result<T> save(T entity) {
        if (entity == null) {
            return Result.failure();
        }
        entity = repository().save(saveBefore(entity));
        if (getId(entity) != null) {
            return Result.success(entity);
        } else {
            return Result.failure();
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public Result<T> update(T entity) {
        if (entity == null || getId(entity) == null) {
            return Result.failure();
        }
        repository().save(updateBefore(entity));
        return Result.success(entity);
    }

    public Result<T> findById(ID id) {
        Optional<T> result = repository().findById(id);
        return result.map(Result::success).orElseGet(Result::failure);
    }

    public Result<Void> deleteById(ID id) {
        repository().deleteById(id);
        return Result.success();
    }
}
