import express from 'express'
import fs from 'fs'

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Wordle Here!')
})

app.get('/words', async (req, res) => {
    const content = fs.readFileSync('server/words.txt', 'utf8')
    debugger;
    const words = content.split(" ")
    res.send(words)
})

app.listen(port, () => {
  console.log(`Wordle server listening on port ${port} Haha`)
})