const express = require('express')
const app = express()
const path = require('path')

app.use(express.json())

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '63e5e85605f84ab7a9ced54bbc401567',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

rollbar.log('Hello world')

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.info('Students info was retrieved')
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
           rollbar.error('Empty body was sent')
           res.status(400).send('You must enter a name.')
       } else {
           rollbar.warning('Student already exists')
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
