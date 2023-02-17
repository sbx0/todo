import TopBar from "../components/TopBar";
import TwoEightLayout from "../components/TwoEightLayout";

export default function New() {
    return <div>
        <TopBar/>
        <TwoEightLayout two={'Two'}>
            Eight
        </TwoEightLayout>
    </div>
}
