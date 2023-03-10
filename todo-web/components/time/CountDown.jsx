import moment from "moment";
import {useEffect, useState} from "react";

export default function CountDown({time}) {
    const [left, setLeft] = useState(time);

    useEffect(() => {
        const timer = setInterval(() => {
            setLeft(calLeft(moment.now(), time))
        }, 500);
        return () => clearInterval(timer);
    }, []);

    function calLeft(from, to) {
        to = moment(to);
        let duration = moment.duration(to - from);
        if (duration.asSeconds() > 0) {
            let countdown = duration.years() > 0 ? duration.years() + "年" : "";
            countdown += duration.months() > 0 ? duration.months() + "月" : "";
            countdown += duration.days() > 0 ? duration.days() + "天" : "";
            countdown += duration.hours() > 0 ? duration.hours() + "时" : "";
            countdown += duration.minutes() > 0 ? duration.minutes() + "分" : "";
            countdown += duration.seconds() > 0 ? duration.seconds() + "秒" : "";
            return countdown;
        } else {
            return "已超时"
        }
    }

    return <div>
        {left}
    </div>;
}