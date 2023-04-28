import Input from "../basic/Input";

export default function RecordTime({value, callback}) {
    const changeEvent = (value) => {
        callback(value);
    }

    return <>
        <Input type="date"
               defaultValue={value}
               onChange={event => changeEvent(event.target.value)}/>
        <style jsx>{`

        `}</style>
    </>
}
