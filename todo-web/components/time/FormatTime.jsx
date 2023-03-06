import moment from "moment";
import 'moment/locale/zh-cn';

export default ({time}) => {
    return <span title={time}>{moment(time).fromNow()}</span>
}