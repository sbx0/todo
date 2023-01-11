import styles from "./AssetType.module.css";

export default function AssetType({value, initData, callback}) {
    const name = 'asset_type';
    const clickEvent = (value) => {
        callback(value);
    }

    return <div className={styles.container}>
        <div className={styles.scrollBar}>
            {
                initData.map((one) => <div key={one.id} className={styles.item}>
                    <input id={name + '_' + one.typeName}
                           name={name}
                           type="radio"
                           defaultChecked={value === one.id}
                           value={one.id}
                           onClick={event => {
                               clickEvent(event.target.value);
                           }}
                           hidden/>
                    <div className={styles.itemBackgroundColor}>
                        <label className={styles.label}
                               htmlFor={name + '_' + one.typeName}>
                            {one.typeName}
                        </label>
                    </div>
                </div>)
            }
        </div>
    </div>
}
