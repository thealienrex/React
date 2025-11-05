import { useEffect, useState } from "react";
import useSound from "use-sound";
import yellowBtnSound from "./sound/yellow.wav";
import redBtnSound from "./sound/red.wav";
import blueBtnSound from "./sound/blue.wav";
import greenBtnSound from "./sound/green.wav";

export default function App() {
  const [successCount, setSuccessCount] = useState(0);

  return (
    <div className="App">
      <Header />
      <PlayTime onSucCount={setSuccessCount} sucCount={successCount} />
      <Counter count={successCount} />
    </div>
  );
}

function Header() {
  return (
    <header>
      <h1>Follow Simon</h1>
    </header>
  );
}

function PlayTime({ onSucCount, sucCount }) {
  const [sequenceLength, setSequenceLength] = useState(4);
  const [playerSequence, setPlayerSequence] = useState(0);
  const [currSeq, setCurrSeq] = useState([]);
  const [playReady, setPlayReady] = useState(false);
  const [playyellow] = useSound(yellowBtnSound);
  const [playblue] = useSound(blueBtnSound);
  const [playred] = useSound(redBtnSound);
  const [playgreen] = useSound(greenBtnSound);
  const [buttonImage, setButtonImage] = useState([
    "yellow",
    "red",
    "blue",
    "green",
  ]);
  const buttonURLS = {
    red: "img/red-button-ur.png",
    redlit: "img/red-button-ur-lit.png",
    yellow: "img/yellow-button-ul.png",
    yellowlit: "img/yellow-button-ul-lit.png",
    blue: "img/blue-button-ll.png",
    bluelit: "img/blue-button-ll-lit.png",
    green: "img/green-button-lr.png",
    greenlit: "img/green-button-lr-lit.png",
  };

  function startPlay(e) {
    setPlayReady(true);

    //build and play the sequence
    const seq = [];
    let count = 0;
    const buildnPlay = setInterval(() => {
      seq[count] = buttonImage[Math.floor(Math.random() * 4)];
      buttonCall(seq[count]);
      count++;
      if (count === sequenceLength) {
        clearInterval(buildnPlay);
        setCurrSeq(seq);
      }
    }, 800);
  }

  function playerClick(e) {
    buttonCall(e);
    setTimeout(function () {
      buttonEval(e);
    }, 800);
  }

  function buttonCall(e) {
    setButtonImage((buttonImage) =>
      buttonImage.map((button) => (button === e ? e + "lit" : button))
    );
    switch (e) {
      case "yellow":
        playyellow();
        break;
      case "blue":
        playblue();
        break;
      case "red":
        playred();
        break;
      case "green":
        playgreen();
        break;
      default:
    }
    console.log(e);
    setTimeout(buttonSetBack, 300);
  }

  function buttonSetBack() {
    setButtonImage((buttonImage) =>
      buttonImage.map((button) =>
        button.includes("lit") ? button.replace("lit", "") : button
      )
    );
  }
  function buttonEval(e) {
    console.log(currSeq[playerSequence], e);
    if (e !== currSeq[playerSequence]) {
      alert("Wrong button! Start over again!");
      setPlayReady(false);
      setCurrSeq([]);
      setSequenceLength(4);
      onSucCount(0);
    } else {
      if (playerSequence !== sequenceLength - 1) {
        setPlayerSequence(playerSequence + 1);
      } else {
        alert("You did it!");
        setCurrSeq([]);
        setSequenceLength(sequenceLength + 1);
        onSucCount(sucCount + 1);
        setPlayReady(false);
      }
    }
  }

  useEffect(() => {
    if (currSeq.length === sequenceLength) {
      console.log(currSeq, sequenceLength);
    }
  }, [currSeq, sequenceLength]);

  return (
    <>
      <SimonPlayer
        buttonLoc={buttonURLS}
        buttonImage={buttonImage}
        onBtnPress={playerClick}
      />
      {!playReady && (
        <div className="startBtn">
          <button className="startBtn" onClick={(e) => startPlay(e)}>
            START
          </button>
        </div>
      )}
    </>
  );
}

function SimonPlayer({ buttonLoc, buttonImage, onBtnPress }) {
  return (
    <div className="simon-player">
      <img
        className="buttontop buttonleft"
        src={buttonLoc[buttonImage[0]]}
        alt="yellow button"
        name="yellow"
        onClick={(e) => {
          onBtnPress(e.target.name);
        }}
      />
      <img
        className="buttontop buttonright"
        src={buttonLoc[buttonImage[1]]}
        alt="red button"
        name="red"
        onClick={(e) => {
          onBtnPress(e.target.name);
        }}
      />
      <img
        className="buttonbottom buttonleft"
        src={buttonLoc[buttonImage[2]]}
        alt="blue button"
        name="blue"
        onClick={(e) => {
          onBtnPress(e.target.name);
        }}
      />
      <img
        className="buttonbottom buttonright"
        src={buttonLoc[buttonImage[3]]}
        alt="green button"
        name="green"
        onClick={(e) => {
          onBtnPress(e.target.name);
        }}
      />
    </div>
  );
}

function Counter({ count }) {
  return (
    <div className="counter">
      <p>Successful sequences: {count}</p>
    </div>
  );
}
