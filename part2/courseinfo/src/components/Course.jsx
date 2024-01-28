
const Header = ({ name }) => <h2>{name}</h2>

const Total = ({ sum }) => <p><b>Total number of exercises {sum}</b></p>

const Part = ({ part }) =>
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) =>
    <>
        {parts.map(part =>
            <Part key={part.id} part={part} />
        )}
    </>

const Course = ({ course }) => {
    return (
        <div>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total sum={course.parts.reduce((accumulator, part) => { return accumulator + part.exercises }, 0)} />
        </div>
    )
}

export default Course