import {calculateTime} from "../../../components/time/CountDown";
import moment from "moment";

const today = '今天';
const monday_begin = '2023-03-13 00:00:00';
const monday_earlier = '2023-03-13 07:59:59';
const monday = '2023-03-13 18:15:00';
const monday_later = '2023-03-13 19:23:59';
const monday_end = '2023-03-13 23:59:59';
const monday_begin_today_expect = today + ' ' + monday_begin.substring(11, 16);
const monday_earlier_today_expect = today + ' ' + monday_earlier.substring(11, 16);
const monday_today_expect = today + ' ' + monday.substring(11, 16);
const monday_later_today_expect = today + ' ' + monday_later.substring(11, 16);

const tomorrow = '明天';
const tuesday_begin = '2023-03-14 00:00:00';
const tuesday_earlier = '2023-03-14 06:59:59';
const tuesday = '2023-03-14 18:15:00';
const tuesday_later = '2023-03-14 20:23:59';
const tuesday_end = '2023-03-14 23:59:59';
const monday_begin_tomorrow_expect = tomorrow + ' ' + tuesday_begin.substring(11, 16);
const monday_earlier_tomorrow_expect = tomorrow + ' ' + tuesday_earlier.substring(11, 16);
const monday_tomorrow_expect = tomorrow + ' ' + tuesday.substring(11, 16);
const monday_later_tomorrow_expect = tomorrow + ' ' + tuesday_later.substring(11, 16);
const tuesday_end_tomorrow_expect = tomorrow;

const wednesday_expect = '周三';
const wednesday_begin = '2023-03-15 00:00:00';
const wednesday_earlier = '2023-03-15 05:59:59';
const wednesday = '2023-03-15 14:15:00';
const wednesday_later = '2023-03-15 19:23:59';
const wednesday_end = '2023-03-15 23:59:59';
const wednesday_begin_tomorrow_expect = wednesday_expect + ' ' + wednesday_begin.substring(11, 16);
const wednesday_earlier_wednesday_expect = wednesday_expect + ' ' + wednesday_earlier.substring(11, 16);
const wednesday_wednesday_expect = wednesday_expect + ' ' + wednesday.substring(11, 16);
const wednesday_later_wednesday_expect = wednesday_expect + ' ' + wednesday_later.substring(11, 16);
const wednesday_end_wednesday_expect = wednesday_expect;

test(monday_begin_today_expect, () => {
    expect(calculateTime(moment(monday), moment(monday_begin))).toBe(monday_begin_today_expect);
});

test(monday_earlier_today_expect, () => {
    expect(calculateTime(moment(monday), moment(monday_earlier))).toBe(monday_earlier_today_expect);
});
test(monday_today_expect, () => {
    expect(calculateTime(moment(monday), moment(monday))).toBe(monday_today_expect);
});

test(monday_later_today_expect, () => {
    expect(calculateTime(moment(monday), moment(monday_later))).toBe(monday_later_today_expect);
});

test(today, () => {
    expect(calculateTime(moment(monday), moment(monday_end))).toBe(today);
});

test(monday_begin_tomorrow_expect, () => {
    expect(calculateTime(moment(monday), moment(tuesday_begin))).toBe(monday_begin_tomorrow_expect);
});

test(monday_earlier_tomorrow_expect, () => {
    expect(calculateTime(moment(monday), moment(tuesday_earlier))).toBe(monday_earlier_tomorrow_expect);
});
test(monday_tomorrow_expect, () => {
    expect(calculateTime(moment(monday), moment(tuesday))).toBe(monday_tomorrow_expect);
});

test(monday_later_tomorrow_expect, () => {
    expect(calculateTime(moment(monday), moment(tuesday_later))).toBe(monday_later_tomorrow_expect);
});

test(tuesday_end_tomorrow_expect, () => {
    expect(calculateTime(moment(monday), moment(tuesday_end))).toBe(tuesday_end_tomorrow_expect);
});

test(wednesday_begin_tomorrow_expect, () => {
    expect(calculateTime(moment(monday), moment(wednesday_begin))).toBe(wednesday_begin_tomorrow_expect);
});

test(wednesday_earlier_wednesday_expect, () => {
    expect(calculateTime(moment(monday), moment(wednesday_earlier))).toBe(wednesday_earlier_wednesday_expect);
});

test(wednesday_wednesday_expect, () => {
    expect(calculateTime(moment(monday), moment(wednesday))).toBe(wednesday_wednesday_expect);
});

test(wednesday_later_wednesday_expect, () => {
    expect(calculateTime(moment(monday), moment(wednesday_later))).toBe(wednesday_later_wednesday_expect);
});

test(wednesday_end_wednesday_expect, () => {
    expect(calculateTime(moment(monday), moment(wednesday_end))).toBe(wednesday_end_wednesday_expect);
});