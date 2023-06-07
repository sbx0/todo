import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import TaskList from "../components/TaskList";
import Button from "../components/basic/Button";
import {useRouter} from "next/router";
import Padding from "../components/beta/Padding";

export default function Index() {
    const router = useRouter();
    return <Container>
        <Padding>
            <Button
                onClick={() => router.push("/task/0")}>
                Go Beta
            </Button>
        </Padding>
        <TaskList taskStatus={0}/>
        <NavigationBar active={0}/>
    </Container>
}
