export const POST = "POST";
export const GET = "GET";
export const ApiPrefix = "http://";
export const TaskPaging = "/api/task/paging";

export function buildDefaultParamsForTaskPaging(categoryId) {
    return {
        "page": 1,
        "pageSize": 20,
        "taskStatus": 0,
        "categoryId": categoryId,
        "orders": [{"name": "create_time", "direction": "desc"}]
    };
}

export const CategoryPaging = "/api/category/paging";

export function buildDefaultParamsForCategoryPaging() {
    return {
        "page": 1,
        "pageSize": 20,
        "orders": [{"name": "create_time", "direction": "desc"}]
    };
}

export const TaskStatistics = "/api/task/statistics";

export function buildDefaultParamsForTaskStatistics(categoryId) {
    return {
        "categoryId": categoryId,
    };
}
