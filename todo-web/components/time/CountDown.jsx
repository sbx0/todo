import moment from "moment";
import {useEffect, useState} from "react";

export function calculateTime(from, to) {
    let result = '';
    let time = moment(to).format('HH:mm');
    if (time !== '23:59') {
        result += ' ' + time;
    }
    let now = moment(from).format('yyyy-MM-DD');
    let except = moment(to).format('yyyy-MM-DD');
    if (now === except) {
        result = '今天' + result;
        return result;
    }
    now = moment(from).add(1, 'days').format('yyyy-MM-DD')
    if (now === except) {
        result = '明天' + result;
        return result;
    }
    let duration = moment.duration(to - from);
    let number = duration.asDays();
    if (number > 0) {
        if (number < (7 - moment(from).day())) {
            result = calculateWeek(to) + result;
        } else if (number < (14 - moment(from).day())) {
            result = '下' + calculateWeek(to) + result;
        } else {
            result = number.toFixed(0) + ' 天';
        }
    } else {
        result = '已过期 ' + -number + ' 天';
    }
    return result;
}

export function calculateWeek(date) {
    let week = moment(date).day()
    switch (week) {
        case 1:
            return '周一'
        case 2:
            return '周二'
        case 3:
            return '周三'
        case 4:
            return '周四'
        case 5:
            return '周五'
        case 6:
            return '周六'
        case 0:
            return '周日'
    }
}

export default function CountDown({time}) {
    const [left, setLeft] = useState(calculateTime(moment.now(), moment(time)));

    useEffect(() => {
        const timer = setInterval(() => {
            setLeft(calculateTime(moment.now(), moment(time)))
        }, 500);
        return () => clearInterval(timer);
    }, [time]);

    return <span title={time}>
        {left}
    </span>;
}