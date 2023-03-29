import FoamBox from "./FoamBox";
import Button from "../basic/Button";

export function SelectBox(props) {

    const choose = (key) => {
        props.click(key);
        props.reset();
    }

    return <div onClick={() => props.show ? null : props.reset(props.index)}
                className="container">
        <FoamBox>
            <Button onClick={() => props.reset()}>
                {props.title}
            </Button>
        </FoamBox>
        {
            props.show ?
                <div name='options'>
                    {props.options.map((option) =>
                        <FoamBox key={option.key}>
                            <Button onClick={() => choose(option.key)}>
                                {option.name}
                            </Button>
                        </FoamBox>)}
                    {props.other}
                </div>
                :
                <div/>
        }
        <style jsx>{`
          .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            text-align: center;
          }

          .select {
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            text-align: center;
            background-color: #262626;
          }

          .button {
            width: 100%;
            height: 40px;
            line-height: 34px;
            font-size: 16px;
            text-align: center;
          }
        `}</style>
    </div>
}