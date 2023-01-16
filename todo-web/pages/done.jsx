import NavigationBar from "../components/NavigationBar";
import TaskList from "../components/TaskList";
import Container from "../components/Container";
import {callApi} from "../apis/taskApi";
import {
    ApiPrefix,
    buildDefaultParamsForCategoryPaging,
    buildDefaultParamsForTaskPaging,
    buildDefaultParamsForTaskStatistics,
    CategoryPaging,
    GET,
    POST,
    TaskPaging,
    TaskStatistics
} from "../apis/apiPath";

export default ({initData, category, statistics}) => {

    return <Container>
        <TaskList initData={initData}
                  category={category}
                  statistics={statistics}
                  taskStatus={1}
                  timeType={'update_time'}
                  orderBy={'update_time'}/>
        <NavigationBar active={1}/>
    </Container>
}

export async function getServerSideProps({req, query}) {
    let categoryId = 0;
    if (query.categoryId != null) {
        categoryId = query.categoryId;
    }

    const result = await callApi({
        method: POST,
        url: ApiPrefix + req.headers.host + TaskPaging,
        params: buildDefaultParamsForTaskPaging(categoryId)
    });

    const category = await callApi({
        method: POST,
        url: ApiPrefix + req.headers.host + CategoryPaging,
        params: buildDefaultParamsForCategoryPaging()
    });

    const statistics = await callApi({
        method: GET,
        url: ApiPrefix + req.headers.host + TaskStatistics,
        params: buildDefaultParamsForTaskStatistics(categoryId)
    });

    return {
        props: {
            initData: result.data,
            category: category.data,
            statistics: statistics.data
        }
    }
}

