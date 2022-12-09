package cn.sbx0.todo.service;


import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;

/**
 * @author sbx0
 * @since 2022/12/1
 */
public interface JpaService<T, ID> {

  Result<T> save(T entity);

  Result<T> update(T entity);

  Result<T> findById(ID id);

  <C extends PagingRequest> Paging<T> paging(C pagingRequest);

  Result<Void> deleteById(ID id);
}
