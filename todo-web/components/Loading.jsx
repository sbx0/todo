export default function Loading({active}) {
    if (active) {
        return <div className="ladingContainer">
            <div className="ldsSpinner">
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
            <style jsx>{`
              .ladingContainer {
                position: absolute;
                top: 30vh;
                left: 0;
                width: 100%;
                height: 100%;
              }

              .ldsSpinner {
                color: official;
                display: block;
                position: relative;
                width: 80px;
                height: 80px;
                margin: 0 auto;
                transform-origin: 40px 40px;
                transform: scale(0.4);
                z-index: 999999;
              }

              .ldsSpinner div {
                transform-origin: 40px 40px;
                animation: ldsSpinner 0.6s linear infinite;
              }

              .ldsSpinner div:after {
                content: " ";
                display: block;
                position: absolute;
                top: 3px;
                left: 37px;
                width: 6px;
                height: 18px;
                border-radius: 20%;
                background: #fff;
              }

              .ldsSpinner div:nth-child(1) {
                transform: rotate(0deg);
                animation-delay: -0.55s;
              }

              .ldsSpinner div:nth-child(2) {
                transform: rotate(30deg);
                animation-delay: -0.5s;
              }

              .ldsSpinner div:nth-child(3) {
                transform: rotate(60deg);
                animation-delay: -0.45s;
              }

              .ldsSpinner div:nth-child(4) {
                transform: rotate(90deg);
                animation-delay: -0.4s;
              }

              .ldsSpinner div:nth-child(5) {
                transform: rotate(120deg);
                animation-delay: -0.35s;
              }

              .ldsSpinner div:nth-child(6) {
                transform: rotate(150deg);
                animation-delay: -0.3s;
              }

              .ldsSpinner div:nth-child(7) {
                transform: rotate(180deg);
                animation-delay: -0.25s;
              }

              .ldsSpinner div:nth-child(8) {
                transform: rotate(210deg);
                animation-delay: -0.1s;
              }

              .ldsSpinner div:nth-child(9) {
                transform: rotate(240deg);
                animation-delay: -0.075s;
              }

              .ldsSpinner div:nth-child(10) {
                transform: rotate(270deg);
                animation-delay: -0.05s;
              }

              .ldsSpinner div:nth-child(11) {
                transform: rotate(300deg);
                animation-delay: -0.025s;
              }

              .ldsSpinner div:nth-child(12) {
                transform: rotate(330deg);
                animation-delay: 0s;
              }

              @keyframes ldsSpinner {
                0% {
                  opacity: 1;
                }
                100% {
                  opacity: 0;
                }
              }
            `}</style>
        </div>;
    } else {
        return <></>;
    }
}
