const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000
const OpenAI = require('openai');
const tokenCounter = require('openai-gpt-token-counter');


const openAi = new OpenAI({
  apiKey: "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",
});

const app = express()

app.use(bodyParser.json());
app.use(cors());

let message = []
let response = []

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/chat', async (req, res) => {
  const { messages } = req.body;
  const model = "gpt-3.5-turbo";

  const newMessage = { "role": "user", "content": `${messages}` }
  message.push(newMessage)

  const history = [...message, ...response]

  const completion = await openAi.chat.completions.create({
    model,
    messages: history,
  })

  let newAssistantMessage = { "role": "assistant", "content": `${completion.choices[0].message.content}` }
  response.push(newAssistantMessage)

  console.log(message.length)

  res.json({
    completion: completion.choices[0].message,
    usage: completion.usage,
    history
  })

  // const tokenCount = tokenCounter.chat(history, model);
  // console.log(`Token count: ${tokenCount}`);

  // if (tokenCount > 100) {
  //   const completion = await openAi.chat.completions.create({
  //     model,
  //     messages: [...history, { "role": "user", "content": 'take out specific keywords from previous messages in points which we can use in future messages' }],
  //   })

  //   const keyPoints = completion.choices[0].message.content.split(':')[1]
  //   const Dose = keyPoints.replace(/\n/g, ' ')
  //   history = [{ ...completion.choices[0].message, 'content': Dose }]
  //   return res.json({
  //     msg: 'limit exceeded',
  //     completion: completion.choices[0].message,
  //     keyPoints,
  //     Dose,
  //     history,
  //   })
  // }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))