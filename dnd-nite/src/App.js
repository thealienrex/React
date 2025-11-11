import { useEffect, useState } from "react";
import { initialSet } from "./starter";

export default function App() {
  const [players, setPlayers] = useState(initialSet);
  const [visiblePage, setVisiblePage] = useState(0);

  function handlePlayerAdd(player) {
    setPlayers((players) => [...players, player]);
  }

  function handlePageSelect(e) {
    let pageChoice = e;

    if (pageChoice !== visiblePage) {
      setVisiblePage(e);
    }
  }

  return (
    <main>
      <Header onPageSelect={handlePageSelect} viz={visiblePage} />
      <section>
        {visiblePage === 0 ? (
          <FindPlayers groupy={players} />
        ) : (
          <AddPlayers onAdd={handlePlayerAdd} />
        )}
      </section>
      <Footer />
    </main>
  );
}

function Header({ onPageSelect, viz }) {
  return (
    <header>
      <div>
        <h1>D&D Nite</h1>
        <p>Assemble your adventuring party here.</p>
      </div>
      <nav>
        <button
          className={viz === 0 ? "find active" : "find"}
          onClick={() => onPageSelect(0)}
        >
          Find Players
        </button>
        <button
          className={viz === 1 ? "add active" : "add"}
          onClick={() => onPageSelect(1)}
        >
          Add Players
        </button>
      </nav>
    </header>
  );
}

function AddPlayers({ onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [availDay, setAvailDay] = useState([]);
  const [timez, setTimez] = useState("");
  const [ptype, setPtype] = useState([]);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !name ||
      !email ||
      availDay.length === 0 ||
      !timez ||
      ptype.length === 0
    ) {
      alert("You must fill in all fields!");
      return;
    }
    const id = Date.now() + Math.random() * 1000;

    const newPlayer = {
      id,
      name,
      email,
      availDay,
      timez,
      ptype,
    };

    onAdd(newPlayer);

    setSuccess(true);

    setName("");
    setEmail("");
    setAvailDay([]);
    setTimez("");
    setPtype([]);
  }

  return (
    <div className="addPlayerContainer">
      <h1>Add Players</h1>
      <em>Continental US, Canada, and Mexico only, please</em>
      <div className="addPlayerFormFields">
        <form onSubmit={handleSubmit}>
          <div className="addPlayerTop">
            <h3>Player Name</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSuccess(false);
              }}
            />
          </div>
          <div className="addPlayerTop">
            <h3>Email</h3>
            <input
              type="email"
              value={email}
              placeholder="me@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
                setSuccess(false);
              }}
            />
          </div>
          <h3>
            Days Available{" "}
            <span className="directionText">(select multiple)</span>
          </h3>
          <DaysList daylist={availDay} onDaysAdd={setAvailDay} />
          <h3>
            Timezone <span className="directionText">(choose one)</span>
          </h3>
          <Timezone timez={timez} onTimezAdd={setTimez} />
          <h3>
            Player Type <span className="directionText">(select multiple)</span>
          </h3>
          <PlayerType onPtype={setPtype} ptyper={ptype} />
          <button type="submit">Add Player</button>
          {success ? (
            <p className="addSuccess">A new player has been added!</p>
          ) : (
            ""
          )}
        </form>
      </div>
    </div>
  );
}

function FindPlayers({ groupy }) {
  const [daysz, setDayz] = useState([]);
  const [tzone, setTzone] = useState("");
  const [ptypef, setPtypef] = useState([]);
  const [filtergroup, setFilter] = useState(groupy);

  function handleDay(days) {
    setDayz(days);
  }

  function handleTimeZone(tzone) {
    setTzone(tzone);
  }

  function handlePlayerChoice(choices) {
    setPtypef(choices);
  }

  function resetItAll() {
    setDayz([]);
    setTzone("");
    setPtypef([]);
  }

  useEffect(() => {
    setFilter(
      groupy.filter(
        (el) =>
          (daysz.length === 0 ||
            el.availDay.some((day) => daysz.includes(day))) &&
          (tzone === "" || el.timez === tzone) &&
          (ptypef.length === 0 ||
            el.ptype.some((type) => ptypef.includes(type)))
      )
    );
  }, [daysz, tzone, ptypef, groupy]);

  return (
    <div className="findPlayersPage">
      <div className="findPlayersFilters">
        <h1>Find Players</h1>
        <h3>
          Available days{" "}
          <span className="directionText">(select multiple)</span>
        </h3>
        <DaysList daylist={daysz} onDaysAdd={handleDay} />
        <h3>Timezone</h3>
        <Timezone timez={tzone} onTimezAdd={handleTimeZone} />
        <h3>
          Player Type <span className="directionText">(select multiple)</span>
        </h3>
        <PlayerType onPtype={handlePlayerChoice} ptyper={ptypef} />
        <button onClick={resetItAll} className="reset">
          Reset
        </button>
      </div>
      <FilteredList finalGroup={filtergroup} />
    </div>
  );
}

function FilteredList({ finalGroup }) {
  return (
    <div className="playerInfoBox">
      {finalGroup.map((person) => (
        <PlayerInfo peep={person} key={person.id} />
      ))}
    </div>
  );
}

function PlayerInfo({ peep }) {
  function iterateList(listy) {
    let text = "";
    for (let i = 0; i < listy.length; i++) {
      if (i > 0) {
        text += ", ";
      }
      text += listy[i];
    }
    return text;
  }

  return (
    <div className="playerInfo">
      <div>
        <h4>{peep.name}</h4>
        <a href={"mailto:" + peep.email}>{peep.email}</a>
      </div>
      <div>
        <h4>Days Available</h4> {iterateList(peep.availDay)}
      </div>
      <div>
        <h4>Timezone</h4> {peep.timez}
      </div>
      <div>
        <h4>Player Type</h4> {iterateList(peep.ptype)}
      </div>
    </div>
  );
}

function DaysList({ daylist, onDaysAdd }) {
  function handleMultiDay(e) {
    let dayIndex = daylist.indexOf(e);
    if (dayIndex >= 0) {
      onDaysAdd(daylist.filter((day) => day !== e));
    } else {
      onDaysAdd([...daylist, e]);
    }
  }
  return (
    <div className="dayList">
      <button
        type="button"
        className={daylist.includes("Monday") ? "active" : ""}
        onClick={() => handleMultiDay("Monday")}
      >
        Monday
      </button>
      <button
        type="button"
        className={daylist.includes("Tuesday") ? "active" : ""}
        onClick={() => handleMultiDay("Tuesday")}
      >
        Tuesday
      </button>
      <button
        type="button"
        className={daylist.includes("Wednesday") ? "active" : ""}
        onClick={() => handleMultiDay("Wednesday")}
      >
        Wednesday
      </button>
      <button
        type="button"
        className={daylist.includes("Thursday") ? "active" : ""}
        onClick={() => handleMultiDay("Thursday")}
      >
        Thursday
      </button>
      <button
        type="button"
        className={daylist.includes("Friday") ? "active" : ""}
        onClick={() => handleMultiDay("Friday")}
      >
        Friday
      </button>
      <button
        type="button"
        className={daylist.includes("Saturday") ? "active" : ""}
        onClick={() => handleMultiDay("Saturday")}
      >
        Saturday
      </button>
      <button
        type="button"
        className={daylist.includes("Sunday") ? "active" : ""}
        onClick={() => handleMultiDay("Sunday")}
      >
        Sunday
      </button>
    </div>
  );
}

function Timezone({ timez, onTimezAdd }) {
  return (
    <div className="timezList">
      <button
        type="button"
        className={timez === "Alaskan" ? "active" : ""}
        onClick={() => onTimezAdd("Alaskan")}
      >
        Alaskan
      </button>
      <button
        type="button"
        className={timez === "Pacific" ? "active" : ""}
        onClick={() => onTimezAdd("Pacific")}
      >
        Pacific
      </button>
      <button
        type="button"
        className={timez === "Mountain" ? "active" : ""}
        onClick={() => onTimezAdd("Mountain")}
      >
        Mountain
      </button>
      <button
        type="button"
        className={timez === "Central" ? "active" : ""}
        onClick={() => onTimezAdd("Central")}
      >
        Central
      </button>
      <button
        type="button"
        className={timez === "Eastern" ? "active" : ""}
        onClick={() => onTimezAdd("Eastern")}
      >
        Eastern
      </button>
    </div>
  );
}

function PlayerType({ onPtype, ptyper }) {
  function handleMulti(e) {
    let isPresent = ptyper.indexOf(e);
    if (isPresent >= 0) {
      onPtype(ptyper.filter((item) => item !== e));
    } else {
      onPtype([...ptyper, e]);
    }
  }

  return (
    <div className="ptypeList">
      <button
        type="button"
        className={ptyper.includes("Player") ? "active" : ""}
        onClick={() => handleMulti("Player")}
      >
        Player
      </button>
      <button
        type="button"
        className={ptyper.includes("GM") ? "active" : ""}
        onClick={() => handleMulti("GM")}
      >
        GM
      </button>
    </div>
  );
}

function Footer() {
  return <div className="footer">&copy; Copyright 2025</div>;
}
