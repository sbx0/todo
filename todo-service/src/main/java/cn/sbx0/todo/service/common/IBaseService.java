package cn.sbx0.todo.service.common;


/**
 * @author sbx0
 * @since 2022/12/1
 */
public interface IBaseService<T, ID> {

  Result<T> save(T entity);

  Result<T> update(T entity);

  Result<T> findById(ID id);

  Paging<T> paging(int page, int pageSize);

  Result<Void> deleteById(ID id);
}
