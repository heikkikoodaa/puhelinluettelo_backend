const express = require('express')

const app = express()
const PORT = 3001

app.use(express.json())

const persons = [
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

app.get('/api/persons', (req, res) => {
  res.status(200).json(persons)
})

app.listen(PORT, (err) => {
  if (err) console.log(`[ERROR]: Error in server setup ${err}`)
  console.log(`[INFO]: Server running on port ${PORT}`)
})