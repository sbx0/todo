import styles from "./Input.module.css"

export default function Input({id, label, type = 'text', defaultValue, onChange}) {
    return <div className={`${styles.main}`}>
        <div className={`${styles.label}`}>{label}</div>
        <input id={id}
               className={`${styles.input}`}
               defaultValue={defaultValue}
               onChange={onChange}
               type={type}/>
    </div>
}