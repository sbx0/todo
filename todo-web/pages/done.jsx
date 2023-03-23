import NavigationBar from "../components/NavigationBar";
import TaskList from "../components/TaskList";
import Container from "../components/Container";
import {getCurrentCategory} from "../components/task/TaskCategory";
import useTask from "../hooks/useTask";
import useCategory from "../hooks/useCategory";
import useStatistics from "../hooks/useStatistics";

export default function Done() {
    const task = useTask(1, 20, 1, getCurrentCategory());
    const category = useCategory(1, 20);
    const statistics = useStatistics(getCurrentCategory());

    return <Container>
        <TaskList initData={task.response}
                  category={category.response?.data}
                  statistics={statistics.response?.data}
                  taskStatus={1}/>
        <NavigationBar active={1}/>
    </Container>
}