import { useState } from 'react'

function getRandomInt(max) {
  const r = Math.floor(Math.random() * max)
  console.log(`getRandomInt(): ${r}`)
  return r
}

const Anecdote = (props) => {
  return (
    props.index > -1
      ?
      <div>
        <h2>{props.title} ({(props.index + 1)} of {props.anecdotes.length})</h2>
        <p>{props.anecdotes[props.index]}</p>
        <p>[Voted {props.points[props.index]} times]</p>
      </div>
      :
      <div>
        <h2>{props.title} </h2>
        <p>No anecdote has been voted so far.</p>
      </div>
  )
}

const App = () => {

  const vote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)

    // Find the index of the largest element in the 'points' array
    // If multiple anecdotes are tied for first place the first will be selected
    const mostVoted = copy.indexOf(Math.max.apply(Math, copy))
    console.log('anecdote', mostVoted, 'with', copy[mostVoted], 'votes is the most voted in', copy)
    setMostVoted(mostVoted)
  }

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const [mostVoted, setMostVoted] = useState(-1) // initialize with a negative value

  return (
    <div>
      <Anecdote index={selected} title='Anecdote of the day' anecdotes={anecdotes} points={points} />
      <button onClick={() => { vote(selected) }} >Vote anecdote</button>
      <button onClick={() => { setSelected(getRandomInt(anecdotes.length)) }} >Get a random anecdote</button>
      <Anecdote index={mostVoted} title='Most voted anecdote' anecdotes={anecdotes} points={points} />
    </div>
  )
}

export default App