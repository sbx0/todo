import FoamBox from "./FoamBox";

export function SelectBox(props) {

    const choose = (key) => {
        props.click(key);
        props.reset();
    }

    return <div onClick={() => props.show ? null : props.reset(props.index)}
                className="container">
        <FoamBox>
            <div onClick={() => props.reset()}
                 className="select">
                {props.title}
            </div>
        </FoamBox>
        {
            props.show ?
                <div name='options'>
                    {props.options.map((option) =>
                        <FoamBox key={option.key}>
                            <button onClick={() => choose(option.key)}
                                    className="button">
                                {option.name}
                            </button>
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