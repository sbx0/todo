import styles from './Loading.module.css';

export default function Loading({active}) {
    if (active) {
        return <div className={styles.ladingContainer}>
            <div className={styles.ldsSpinner}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>;
    } else {
        return <></>;
    }
}
