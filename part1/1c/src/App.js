import { useState } from "react";

const Hello = ({ name, age }) => {
  const yearBorn = () => new Date().getFullYear() - age;

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>This means you were probably born in {yearBorn()}</p>
    </div>
  );
};

const History = (props) => {
  if (props.allClicks.length === 0) {
    return <div>the app is used by pressing the buttons</div>;
  }
  return <div>button press history: {props.allClicks.join(" ")}</div>;
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAll] = useState([]);
  const [total, setTotal] = useState(0);

  const handleLeftClick = () => {
    const updatedLeft = left + 1;
    setLeft(updatedLeft);
    setAll(allClicks.concat("L"));
    setTotal(updatedLeft + right);
  };

  const handleRightClick = () => {
    const updatedRight = right + 1;
    setRight(updatedRight);
    setAll(allClicks.concat("R"));
    setTotal(left + updatedRight);
  };

  return (
    <div>
      {left}
      <Button onClick={handleLeftClick} text="left" />
      <Button onClick={handleRightClick} text="right" />
      {right}
      <History allClicks={allClicks} />
    </div>
  );
};

export default App;
