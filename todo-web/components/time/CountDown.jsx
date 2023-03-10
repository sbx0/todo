import moment from "moment";
import {useEffect, useState} from "react";

export default function CountDown({time}) {
    const [left, setLeft] = useState(calLeft(moment.now(), moment(time)));

    useEffect(() => {
        const timer = setInterval(() => {
            setLeft(calLeft(moment.now(), moment(time)))
        }, 500);
        return () => clearInterval(timer);
    }, [time]);

    function calLeft(from, to) {
        let result = '';
        let time = moment(to).format('HH:mm');
        if (time !== '23:59') {
            result += ' ' + time;
        }
        let duration = moment.duration(to - from);
        if (duration.asSeconds() > 0) {
            if (duration.asDays().toFixed(0) === '0') {
                result = '今天' + result;
            } else if (duration.asDays().toFixed(0) === '1') {
                result = '明天' + result;
            } else if (duration.asDays() < (8 - moment(from).day())) {
                result = getWeek(to) + result;
            } else if (duration.asDays() < (15 - moment(from).day())) {
                result = '下' + getWeek(to) + result;
            } else {
                result = duration.asDays().toFixed(0) + ' 天';
            }
        } else {
            result = to;
        }
        return result;
    }

    function getWeek(date) {
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

    return <span title={time}>
        {left}
    </span>;
}