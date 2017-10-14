// Create a HTTP server on port 8000
// Send plain text headers and 'Hello World' to each client

const port = process.env.PORT || 8000
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const R = require('ramda')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res) {
  res.send(
    `You're not suppost to GET this URL but we'll be generous and show you this useless info instead :)))`
  )
})

app.post('/', (req, res) => {
  const isFromOurSlackApp =
    req.body.token && req.body.token === process.env.SLACK_APP_TOKEN
  if (isFromOurSlackApp) {
    console.log('////////////')
    console.log(req.body)
    const challenge = R.pick(['challenge'])
    const { body } = req
    let messageData
    if (body.event.type === 'message') {
      try {
        const cleanedData = cleanUpSlackData(body.event.text)
        sendEmail(JSON.parse(cleanData))
      } catch (error) {
        console.log('message can not be parsed', error)
      }
    }

    res.send(challenge, req.body)
    return
  }

  res.send('request not from our Slack app')
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
})

const cleanUpSlackData = message =>
  message
    .replace(/\n/g, '')
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/<mailto:.*?\|(.*?)>/g, '$1')

const sendEmail = data => {
  sgMail.send(R.pick(['to', 'from', 'subject', 'text', 'html'], data))
}
