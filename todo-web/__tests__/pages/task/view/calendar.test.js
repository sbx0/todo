import {calculateWeeks, getWeekIndex, isToday, isWeekend} from "../../../../pages/task/view/calendar";
import moment from "moment";

const day = '2023-03-29';
const monday = '2023-03-27';
const saturday = '2023-04-01';
test('calculate one month', () => {
    let weeks = calculateWeeks(day);
    expect(weeks.length).toBe(1);
    expect(weeks[0].length).toBe(7);
    expect(weeks[0][0]).toBe("");
    expect(weeks[0][6]).toBe("2023-03-05");
});
test('calculate week index', () => {
    expect(getWeekIndex(day)).toBe(2);
    expect(getWeekIndex(monday)).toBe(0);
});
test('calculate weekend', () => {
    expect(isWeekend(day)).toBe(false);
    expect(isWeekend(monday)).toBe(false);
    expect(isWeekend(saturday)).toBe(true);
});
test('calculate today', () => {
    expect(isToday(day)).toBe(false);
    expect(isToday(moment())).toBe(true);
});