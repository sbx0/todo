import {calculateWeeks} from "../../../../pages/task/view/calendar";
import {randomInt} from "next/dist/shared/lib/bloom-filter/utils";

const day = '2023-03-30';
const expectMonday = '2023-03-27';
test('calculate one week', () => {
    let weeks = calculateWeeks(day);
    expect(weeks.length).toBe(1);
    expect(weeks[0].length).toBe(7);
    expect(weeks[0][0]).toBe(expectMonday);
    expect(weeks[0][3]).toBe(day);
});

test('calculate random weeks', () => {
    const count = randomInt(1, 99);
    let weeks = calculateWeeks(expectMonday, count);
    expect(weeks.length).toBe(count);
    expect(weeks[0].length).toBe(7);
    expect(weeks[0][0]).toBe(expectMonday);
    expect(weeks[0][3]).toBe(day);
});