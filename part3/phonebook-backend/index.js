require('dotenv').config()

const express = require('express')
const app = express()

// const cors = require('cors')
// app.use(cors())

app.use(express.static('dist'))
app.use(express.json())

const morgan = require('morgan')
morgan.token('requestbody', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestbody'))

// Models
const Person = require('./models/person')

app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend</h1>')
})

app.get('/info', (request, response) => {
    Person.find({}).then(people => {
        const timestamp = new Date() // .toLocaleTimeString()
        let html = `<div><p>Phonebook has info for ${people.length} people.</p><ul>`
        people.forEach(person => html += `<li>NAME: ${person.name}, NUMBER: ${person.number}, ID: ${person.id}</li>`)
        html += `</ul><p>${timestamp}</p></div>`
        response.send(html)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    // Check if a person with the same name already exists
    Person
        .find({ name: body.name }).then(people => {
            if (people.length > 0) {
                // Update the number of the existing person
                const personToUpdate = people[0]
                personToUpdate.number = body.number
                personToUpdate.save()
                    .then(updatedPerson => {
                        response.json(updatedPerson)
                    })
                    .catch(error => next(error))
            } else {
                // Create new entry if the person doesn't exist
                const person = new Person({
                    name: body.name,
                    number: body.number,
                })

                person.save()
                    .then(savedPerson => {
                        response.json(savedPerson)
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person
        .findByIdAndUpdate(
            request.params.id,
            { name, number },
            { new: true, runValidators: true, context: 'query' }
        )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

// After every defined route, handle unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// this has to be the last loaded middleware, also all the routes should be registered before this!
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

// Start the server
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})