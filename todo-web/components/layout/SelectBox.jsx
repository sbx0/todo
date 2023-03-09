import styles from "./SelectBox.module.css";
import FoamBox from "./FoamBox";

export function SelectBox(props) {

    const choose = (key) => {
        props.click(key);
        props.reset();
    }

    return <div onClick={() => props.show ? null : props.reset(props.index)}
                className={styles.container}>
        <FoamBox>
            <div onClick={() => props.reset()}
                 className={styles.select}>
                {props.title}
            </div>
        </FoamBox>
        {
            props.show ?
                <div name='options'>
                    {props.options.map((option) =>
                        <FoamBox key={option.key}>
                            <button onClick={() => choose(option.key)}
                                    className={styles.button}>
                                {option.name}
                            </button>
                        </FoamBox>)}
                    {props.other}
                </div>
                :
                <div/>
        }
    </div>
}