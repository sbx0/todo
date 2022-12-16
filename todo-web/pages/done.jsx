import NavigationBar from "../components/NavigationBar";
import StatisticsPanel from "../components/StatisticsPanel";
import TaskList from "../components/TaskList";
import Container from "../components/Container";

export default function Done() {

    return <Container>
        <StatisticsPanel/>
        <TaskList timeType={'update_time'}
                  orderBy={'update_time'}
                  taskStatus={1}/>
        <NavigationBar active={2}/>
    </Container>
}
