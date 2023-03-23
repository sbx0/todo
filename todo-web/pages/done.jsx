import NavigationBar from "../components/NavigationBar";
import TaskList from "../components/TaskList";
import Container from "../components/Container";

export default function Done() {
    return <Container>
        <TaskList taskStatus={1}/>
        <NavigationBar active={1}/>
    </Container>
}