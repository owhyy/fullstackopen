const Header = (props) => {
  return <h2>{props.course.name}</h2>;
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map((p) => (
        <Part key={p.id} part={p} />
      ))}
    </div>
  );
};

const Total = ({ course }) => {
  let total = course.parts.reduce((acc, p) => acc + p.exercises, 0);
  return <p>Number of exercises {total}</p>;
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

export default Course;
