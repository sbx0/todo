import NavigationBar from "../components/NavigationBar";
import TaskList from "../components/TaskList";
import Container from "../components/Container";

export default function Done() {

    return <Container>
        <TaskList timeType={'update_time'}
                  orderBy={'update_time'}
                  taskStatus={1}/>
        <NavigationBar active={2}/>
    </Container>
}
