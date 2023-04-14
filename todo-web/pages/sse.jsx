import Container from "../components/Container";
import {useEffect} from "react";
import {SSE} from "sse.js";
import {getCookie} from "../apis/cookies";

export default function SseChat() {

    useEffect(() => {
        let source = new SSE("/api/sse/subscribe", {
            headers: {
                Authorization: "Bearer " + getCookie("token")
            }
        });

        source.addEventListener("HEARTBEAT", (event) => console.log('HEARTBEAT ' + event.data));

        source.stream();

        return () => {
            source.removeEventListener("HEARTBEAT");
            source.close();
        }
    }, [])

    return <Container>
    </Container>
}
