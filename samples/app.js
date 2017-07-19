const express = require('express')
const app = express()

app.use(express.static('wwwroot'))

app.get('*', function (req, res) {
  console.log(req.params)
  let slug = req.params[0] || ""
  slug = slug.replace(/^\//, "")
  res.sendFile(__dirname + '/index.html')
})

app.listen(5000, function () {
})
