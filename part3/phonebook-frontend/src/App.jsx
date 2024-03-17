import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const NotificationMessage = ({ message }) => {
  return (message === null) ? null : (
    <div className='notification success'>
      {message}
    </div>
  )
}

const ErrorMessage = ({ message }) => {
  return (message === null) ? null : (
    <div className='notification error'>
      {message}
    </div>
  )
}

const Person = ({ person, removePerson }) => {
  return (
    <div>{person.name} {person.number} <button onClick={() => removePerson(person.id, person.name)}>Delete</button></div>
  )
}

const Filter = ({ value, onChange }) => {
  return <div>filter by name: <input value={value} onChange={onChange} /></div>
}

const PersonForm = ({ onSubmit, newNameValue, onNameChange, newNumberValue, onNumberChange, }) => {
  return <form onSubmit={onSubmit}>
    <div>
      name: <input value={newNameValue} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={newNumberValue} onChange={onNumberChange} />
    </div>
    <div>
      <button type='submit'>add</button>
    </div>
  </form>
}

const Persons = ({ persons, removePerson }) => {
  return <div>
    {persons.map((person) =>
      <Person
        key={person.id}
        person={person}
        removePerson={removePerson}
      />
    )}
  </div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showNotification = (message) => {
    setNotificationMessage(
      message
    )
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const showError = (message) => {
    setErrorMessage(
      message
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.some(person => person.name.toLowerCase() === newName.toLowerCase())
    if (nameExists) {
      if (confirm(`${newName} is already added to phonebook. Replace the old number with the new number?`)) {
        console.log('Updating', newName, newNumber, '...')
        const personFound = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
        const changedPerson = { ...personFound, number: newNumber }
        personService
          .update(personFound.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personFound.id ? person : returnedPerson))
            showNotification(`${newName} has been updated.`)
          })
          .catch(error => {
            showError(`Information of ${newName} has been removed from server.`)
          })
      } else {
        console.log(`${newName} has NOT been updated.`)
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          showNotification(`${newName} has been added.`)
        })
      setNewName('')
      setNewNumber('')
    }
  }

  const removePerson = (id, name) => {
    if (confirm(`Delete ${name} ?`)) {
      console.log('Deleting', name, id, '...')
      personService
        .remove(id)
        .then(deletedPerson => {
          setPersons(persons.filter(p => p.id !== id))
        })
    } else {
      console.log(name, 'has NOT been deleted.')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const personsToShow = (nameFilter == '')
    ? persons
    : persons.filter(person => (person.name.toLowerCase().indexOf(nameFilter.toLowerCase()) != -1)
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={nameFilter} onChange={handleNameFilterChange} />

      <h2>Add new Contact</h2>
      <PersonForm onSubmit={addPerson} newNameValue={newName} onNameChange={handleNameChange} newNumberValue={newNumber} onNumberChange={handleNumberChange} />
      <NotificationMessage message={notificationMessage} />
      <ErrorMessage message={errorMessage} />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App