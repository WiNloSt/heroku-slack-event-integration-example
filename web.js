// Create a HTTP server on port 8000
// Send plain text headers and 'Hello World' to each client

const port = process.env.PORT || 8000
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const R = require('ramda')

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
    res.send(R.pick(['challenge'], req.body))
    return
  }

  res.send('request not from our Slack app')
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
})
