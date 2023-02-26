const Header = (props) => {
  return <h1>{props.course.name}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.excersises}
    </p>
  );
};

const Content = (props) => {
  console.log(props)
  return (
    <div>
      {props.course.parts.map((p) => (
        <Part part={p} />
      ))}
    </div>
  );
};

const Total = (props) => {
  let total = props.course.parts.reduce((acc, p) => acc + p.excersises, 0);
  return <p>Number of excersises {total}</p>;
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        excersises: 10,
      },
      {
        name: "Using props to pass data",
        excersises: 7,
      },
      {
        name: "State of a component",
        excersises: 14,
      },
    ],
  };
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

export default App;
