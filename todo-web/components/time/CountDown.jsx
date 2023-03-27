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
        let days = parseFloat(number.toFixed(1));
        if (days > parseInt(days.toFixed(0))) {
            days += 1;
        }
        days = days.toFixed(0)
        result = days + ' 天 ' + calculateWeek(to) + result;
    } else {
        let days = -number.toFixed(0);
        if (days === 0) {
            days = 1;
        }
        result = '超时 ' + days + ' 天';
    }
    return result;
}

const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function calculateWeek(date) {
    let index = moment(date).day()
    return weeks[index];
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