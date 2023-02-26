const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p> Hi mom!</p>
      <p> Hi {props.son}</p>
      <p> Hi ['peter', 'deeznutz']</p>
    </div>
  );
};

const App = () => {
  const now = new Date();
  const a = 2;
  const b = 2;
  console.log("hi mom");
  return (
    <>
      <p>Hello world! It's {now.toString()}</p>
      <p>
        {a} + {b} is {a + b}, - 1 that's {a + b - 1} quick maths
      </p>
      <Hello son="john" />
    </>
  );
};

export default App;
