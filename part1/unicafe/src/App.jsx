import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>{props.text}</button>
  )
}

const StatisticLine = (props) => {
  return (
    <tr><td>{props.text}</td><td>{props.value} {props.suffix}</td></tr>
  )
}

const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad
  const average = (props.good * 1 + props.bad * -1) / total
  const positive = props.good / total

  return (
    total > 0
      ?
      <table>
        <tbody>
          <StatisticLine text='Good' value={props.good} />
          <StatisticLine text='Neutral' value={props.neutral} />
          <StatisticLine text='Bad' value={props.bad} />
          <StatisticLine text='Total' value={total} />
          <StatisticLine text='Average' value={round(average, 3)} />
          <StatisticLine text='Positive' value={round(positive * 100, 3)} suffix=' %' />
        </tbody>
      </table>
      :
      <div>No feedback given.</div>
  )
}

const round = (value, decimals) => {
  const x = Math.pow(10, decimals)
  return Math.round(value * x, decimals) / x
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={() => { setGood(good + 1) }} text='Good' />
      <Button handleClick={() => { setNeutral(neutral + 1) }} text='Neutral' />
      <Button handleClick={() => { setBad(bad + 1) }} text='Bad' />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App