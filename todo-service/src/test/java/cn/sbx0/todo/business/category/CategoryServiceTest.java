package cn.sbx0.todo.business.category;

import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.repositories.CategoryRepository;
import cn.sbx0.todo.service.common.Code;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Paging.PagingCommon;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@MockBean(classes = {CategoryRepository.class})
@SpringBootTest(webEnvironment = WebEnvironment.NONE, classes = {CategoryService.class})
class CategoryServiceTest {

    @Autowired
    private CategoryService service;

    @Resource
    private CategoryRepository repository;

    @Test
    public void paging() {
        DefaultPagingRequest pagingRequest = new DefaultPagingRequest(1, 1);

        List<CategoryEntity> data = new ArrayList<>();
        data.add(new CategoryEntity("test"));
        Page<CategoryEntity> pagingData = new PageImpl<>(data,
                Paging.build(pagingRequest.getPage(), pagingRequest.getPageSize()),
                data.size()
        );
        given(repository.findAll(ArgumentMatchers.any(Pageable.class))).willReturn(pagingData);

        Paging<CategoryEntity> paging = service.paging(pagingRequest);
        assertNotNull(paging);
        assertTrue(paging.getSuccess());
        assertEquals(Code.SUCCESS, paging.getCode());

        PagingCommon common = paging.getCommon();
        assertNotNull(common);
        assertEquals(pagingRequest.getPage(), common.getPage());
        assertEquals(pagingRequest.getPageSize(), common.getPageSize());
        assertEquals(data.size(), common.getTotal());
    }

    @Test
    void save() {
        // id is null after save
        CategoryEntity entity = new CategoryEntity("test");
        given(repository.save(any())).willReturn(entity);

        Result<CategoryEntity> result = service.save(entity);
        assertNotNull(result);
        assertFalse(result.getSuccess());
        assertEquals(Code.FAILED, result.getCode());

        assertNull(result.getData());

        // id is 1L after save
        Long id = 1L;
        entity.setId(id);
        given(repository.save(any())).willReturn(entity);

        result = service.save(entity);
        assertNotNull(result);
        assertTrue(result.getSuccess());
        assertEquals(Code.SUCCESS, result.getCode());
        assertEquals(id, result.getData().getId());
    }

    @Test
    void update() {
        // id is null
        CategoryEntity entity = new CategoryEntity("test");
        given(repository.save(any())).willReturn(entity);

        Result<CategoryEntity> result = service.update(entity);
        assertNotNull(result);
        assertFalse(result.getSuccess());
        assertEquals(Code.FAILED, result.getCode());

        assertNull(result.getData());

        // id is 1L after save
        Long id = 1L;
        entity.setId(id);
        given(repository.save(any())).willReturn(entity);

        result = service.update(entity);
        assertNotNull(result);
        assertTrue(result.getSuccess());
        assertEquals(Code.SUCCESS, result.getCode());
        assertEquals(id, result.getData().getId());
    }

    @Test
    void findById() {
        Long id = 1L;
        CategoryEntity entity = new CategoryEntity(id, "test");
        given(repository.findById(id)).willReturn(Optional.of(entity));

        Result<CategoryEntity> result = service.findById(1L);
        assertNotNull(result);
        assertTrue(result.getSuccess());
        assertEquals(Code.SUCCESS, result.getCode());
        assertNotNull(result.getData());
        assertEquals(id, result.getData().getId());
        assertEquals(entity.getCategoryName(), result.getData().getCategoryName());
    }

    @Test
    void deleteById() {
        Long id = 1L;
        Result<Void> result = service.deleteById(id);
        assertNotNull(result);
        assertTrue(result.getSuccess());
        assertEquals(Code.SUCCESS, result.getCode());
    }
}
