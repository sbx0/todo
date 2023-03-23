import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import TaskList from "../components/TaskList";
import useTask from "../hooks/useTask";
import useCategory from "../hooks/useCategory";
import useStatistics from "../hooks/useStatistics";
import {getCurrentCategory} from "../components/task/TaskCategory";

export default function Index() {
    const task = useTask(1, 20, 0, getCurrentCategory());
    const category = useCategory(1, 20);
    const statistics = useStatistics(getCurrentCategory());

    return <Container>
        <TaskList initData={task.response}
                  category={category.response?.data}
                  statistics={statistics.response?.data}
                  taskStatus={0}/>
        <NavigationBar active={0}/>
    </Container>
}
