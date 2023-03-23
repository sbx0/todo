import NavigationBar from "../components/NavigationBar";
import TaskList from "../components/TaskList";
import Container from "../components/Container";
import {getCurrentCategory} from "../components/task/TaskCategory";
import useTask from "../hooks/useTask";
import useCategory from "../hooks/useCategory";

export default function Done() {
    const task = useTask(1, 20, 1, getCurrentCategory());
    const category = useCategory(1, 20);

    return <Container>
        <TaskList initData={task.response}
                  category={category.response?.data}
                  taskStatus={1}/>
        <NavigationBar active={1}/>
    </Container>
}