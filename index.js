const express = require('express')

const app = express()
const PORT = 3001

app.use(express.json())

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

app.listen(PORT, (err) => {
  if (err) console.log(`[ERROR]: Error in server setup ${err}`)
  console.log(`[INFO]: Server running on port ${PORT}`)
})