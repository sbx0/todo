import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import TaskList from "../components/TaskList";

export default function Home() {

    return <Container>
        <TaskList taskStatus={0} timeType={'createTime'}/>
        <NavigationBar active={0}/>
    </Container>
}
