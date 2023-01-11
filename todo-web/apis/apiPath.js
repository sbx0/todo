export const POST = "POST";
export const GET = "GET";
export const ApiPrefix = "http://";
export const API = "/api";
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

export const CategoryPaging = API + "/category/paging";

export function buildDefaultParamsForCategoryPaging() {
    return {
        "page": 1,
        "pageSize": 20,
        "orders": [{"name": "create_time", "direction": "desc"}]
    };
}

export const TaskStatistics = API + "/task/statistics";

export function buildDefaultParamsForTaskStatistics(categoryId) {
    return {
        "categoryId": categoryId,
    };
}

export const AssetRecordPaging = API + "/asset/record/paging";

export function buildDefaultParamsForAssetRecordPaging() {
    return {
        "page": 1,
        "pageSize": 20,
        "orders": [{"name": "create_time", "direction": "desc"}]
    };
}

export const AssetTypePaging = API + "/asset/type/paging";
