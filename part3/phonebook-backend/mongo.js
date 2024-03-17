require('dotenv').config()

const mongoose = require('mongoose')

const Person = require('./models/person')

if (process.argv.length === 4) {
    const personName = process.argv[2]
    const personNumber = process.argv[3]

    const person = new Person({
        name: personName,
        number: personNumber,
    })

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
