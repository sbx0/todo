import styles from "./RecordTime.module.css";

export default function RecordTime({value, callback}) {
    const changeEvent = (value) => {
        callback(value);
    }

    return <div className={styles.container}>
        <input className={styles.input}
               type="date"
               value={value}
               onChange={event => changeEvent(event.target.value)}/>
    </div>
}
