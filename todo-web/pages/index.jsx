import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import TaskList from "../components/TaskList";

export default function Home() {

    return <Container>
        <TaskList taskStatus={0} orderBy={'create_time'} timeType={'create_time'}/>
        <NavigationBar active={0}/>
    </Container>
}
