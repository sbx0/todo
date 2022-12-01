package cn.sbx0.todo.service.common;

import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/1
 */
public interface IBaseService<T, ID> {

  Result<ID> save(T entity);

  Result<T> findById(ID id);

  Paging<List<T>> paging(int page, int pageSize);

  Result<Void> deleteById(ID id);
}
