const Header = ({ course }) => {
  return (
    <h2>{course.name}</h2>
  );
};

const Total = ({ parts }) => {
  const totalExercises = parts.reduce(
    (sum, part) => sum + part.exercises, 0
  );

  return (
    <p><b>Total of {totalExercises} exercises</b></p>
  );
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </>
  );
};

const Course = ({ courses }) => {
  return (
    <>
      {courses.map(course =>
        <section key={course.id}>
          <Header course={course} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </section>
      )}
    </>
  );
};

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ];

  return (
    <>
      <h1>Web development curriculum</h1>
      <Course courses={courses} />
    </>
  );
};

export default App;
