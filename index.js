const express = require('express')
const morgan = require('morgan')

const app = express()
const PORT = 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

morgan.token('body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '')

app.use(morgan(':method :url :status :response-time ms - :body'))

let persons = [
  {
    id: 1,
    name: 'Kazuma Kiryu',
    number: '045-7654321'
  },
  {
    id: 2,
    name: 'Yuki Kawamura',
    number: '044-5671234'
  },
  {
    id: 3,
    name: 'Aiko Murasaki',
    number: '044-6712345'
  },
  {
    id: 4,
    name: 'Akane Ishi',
    number: '044-2345671'
  },
]

const generateUniqueId = () => {
  return Math.floor(Math.random() * 100000)
}

const findUniqueId = (personsArray) => {
  let unique = false
  let randomId

  while (!unique) {
    randomId = generateUniqueId()

    unique = persons.every(person => person.id !== randomId)
  }

  return randomId
}

const checkForValidRequestBody = (body) => {
  const errors = []

  if (!body || Object.keys(body).length === 0) {
    errors.push('Request body is empty')
  }

  if (!body.name) {
    errors.push('Name is missing')
  }

  if (!body.number) {
    errors.push('Number is missing')
  }

  return errors
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/info', (req, res) => {
  const numberOfPeople = persons.length || 0
  const now = new Date()
  const html = `
    <p>Phonebook has info for ${numberOfPeople} people</p>
    <p>${now}</p>
  `

  res.status(200).send(html)
})

app.get('/api/persons', (req, res) => {
  res.status(200).json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id)
  const person = persons.find(person => person.id === personId)

  if (!person) {
    return res.status(404).end()
  }

  res.status(200).send(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id)
  const newPersonsList = persons.filter(person => person.id !== personId)
  persons = newPersonsList

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const bodyErrors = checkForValidRequestBody(body)

  if (bodyErrors.length) {
    return res.status(400).json({ error: bodyErrors })
  }

  const { name, number } = body
  const personAlreadyExists = persons.find(person => {
    const personInBook = person.name.toLowerCase()
    const personToBeAdded = name.toLowerCase()

    return personInBook === personToBeAdded
  })

  if (personAlreadyExists) {
    return res.status(409).json({ error: 'Name must be unique' })
  }

  const newPersonId = findUniqueId(persons)
  const newPerson = {
    id: newPersonId,
    name,
    number
  }
  persons = [...persons, newPerson]

  res.status(200).send('New person successfully created!')
})

app.listen(PORT, (err) => {
  if (err) console.log(`[ERROR]: Error in server setup ${err}`)
  console.log(`[INFO]: Server running on port ${PORT}`)
})