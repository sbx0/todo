import styles from "./Input.module.css";

export default function Input({id, type = 'text', defaultValue, onChange}) {
    return <input id={id}
                  className={styles.input}
                  defaultValue={defaultValue}
                  onChange={onChange}
                  type={type}/>
}