import Input from "../basic/Input";

export default function RecordValue({value, callback}) {

    const changeEvent = (value) => {
        callback(value);
    }

    return <>
        <Input type="number"
               defaultValue={value}
               onChange={event => changeEvent(event.target.value)}/>
        <style jsx>{`

        `}</style>
    </>
}
