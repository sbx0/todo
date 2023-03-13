import {calLeft} from "../../../components/time/CountDown";
import moment from "moment";

test('compute today past time', () => {
    expect(calLeft(moment('2023-03-13 18:15:00'), moment('2023-03-13 18:00:00'))).toBe('今天 18:00');
});