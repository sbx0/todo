import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import TaskList from "../components/TaskList";

export default function Index() {
    return <Container>
        <TaskList taskStatus={0}/>
        <NavigationBar active={0}/>
    </Container>
}
