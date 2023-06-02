import styles from './TextCentered.module.css';

export default function TextCentered({children, className = ''}) {
    return <div className={`${styles.textCenteredHorizontally}`}>
        <div className={`${styles.textCenteredVertically} ${className}`}>
            {children}
        </div>
    </div>;
}