import Container from "../components/Container";
import NavigationBar from "../components/NavigationBar";
import TaskInput from "../components/task/TaskInput";

export default function New() {

    return <Container>
        <TaskInput/>
        <NavigationBar active={1}/>
    </Container>
}
