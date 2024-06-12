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

export default Course;
