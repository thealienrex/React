import { useEffect, useState } from "react";
import { initialSet } from "./starter";

export default function App() {
  const [players, setPlayers] = useState(initialSet);
  const [visiblePage, setVisiblePage] = useState(0);

  function handlePlayerAdd(player) {
    setPlayers((players) => [...players, player]);
  }

  function handlePageSelect(e) {
    e.preventDefault();
    let pageChoice = Number(e.target.name);

    if (pageChoice !== visiblePage) {
      setVisiblePage(Number(e.target.name));
    }
  }

  return (
    <>
      <Header onPageSelect={handlePageSelect} />
      <section className={visiblePage === 0 ? "home" : ""}>
        {visiblePage === 1 ? (
          <AddPlayers onAdd={handlePlayerAdd} />
        ) : visiblePage === 2 ? (
          <FindPlayers groupy={players} />
        ) : (
          <></>
        )}
      </section>
      <Footer />
    </>
  );
}

function Header({ onPageSelect }) {
  return (
    <header>
      <div>
        <h1>D&D Nite</h1>
        <p>Assemble your adventuring party here.</p>
      </div>
      <nav>
        <a name="0" href="http://" onClick={(e) => onPageSelect(e)}>
          Home
        </a>
        <a name="1" href="http://" onClick={(e) => onPageSelect(e)}>
          Add Players
        </a>
        <a name="2" href="http://" onClick={(e) => onPageSelect(e)}>
          Find Players
        </a>
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
    const id = crypto.randomUUID();

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
    /* setPtype([]); */
  }

  return (
    <div className="addPlayerContainer">
      <h3>Add Players</h3>
      <em>Continental US, Canada, and Mexico only, please</em>
      <div className="addPlayerForm">
        <div className="addPlayerFormFields">
          <form onSubmit={handleSubmit}>
            <label>Player Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSuccess(false);
              }}
            />
            <label>Email</label>
            <input
              type="email"
              value={email}
              placeholder="me@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
                setSuccess(false);
              }}
            />
            <DaysList daylist={availDay} onDaysAdd={setAvailDay} />
            <Timezone timez={timez} onTimezAdd={setTimez} />
            <PlayerType onPtype={setPtype} ptyper={ptype} />
            <button>Add Player</button>
          </form>
        </div>
        {success ? <p>A new player has been added!</p> : ""}
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
      groupy.filter((el) => {
        if (
          (daysz.length === 0 ||
            el.availDay.some((ele) => daysz.includes(ele))) &&
          (tzone === "" || tzone === el.timez) &&
          (ptypef.length === 0 || el.ptype.some((elf) => ptypef.includes(elf)))
        ) {
          return el;
        }
      })
    );
  }, [daysz, tzone, ptypef, groupy]);

  return (
    <div className="findPlayersPage">
      <h3>Find Players</h3>
      <div className="findPlayersFilters">
        <DaysList daylist={daysz} onDaysAdd={handleDay} />
        <Timezone timez={tzone} onTimezAdd={handleTimeZone} />
        <PlayerType onPtype={handlePlayerChoice} ptyper={ptypef} />
        <button onClick={resetItAll}>Reset</button>
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
  function handleMulti(e) {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    onDaysAdd(value);
  }
  return (
    <div>
      <label>Available days</label>
      <select value={daylist} multiple onChange={(e) => handleMulti(e)}>
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
        <option>Saturday</option>
        <option>Sunday</option>
      </select>
    </div>
  );
}

function Timezone({ timez, onTimezAdd }) {
  function handleTimeAdd(e) {
    onTimezAdd(e);
  }
  return (
    <div>
      <label>Timezone</label>
      <select value={timez} onChange={(e) => handleTimeAdd(e.target.value)}>
        <option value="">Choose one:</option>
        <option>Alaskan</option>
        <option>Pacific</option>
        <option>Mountain</option>
        <option>Central</option>
        <option>Eastern</option>
      </select>
    </div>
  );
}

function PlayerType({ onPtype, ptyper }) {
  function handleMulti(e) {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    onPtype(value);
  }

  return (
    <div>
      <label>Player Type</label>
      <select value={ptyper} multiple size="2" onChange={(e) => handleMulti(e)}>
        <option>Player</option>
        <option>GM</option>
      </select>
    </div>
  );
}

function Footer() {
  return <div className="footer">&copy; Copyright 2025</div>;
}
