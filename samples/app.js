const express = require('express')
const app = express()

let database = {
  courses: ["test", "test2", "testcourse"]
}

app.use(express.static('wwwroot'))

app.get("/api/v1/courses", function(req, res) {
  res.send(JSON.stringify(database.courses));
})

app.put("/api/v1/course", function(req, res) {

  
  res.send(JSON.stringify(database.courses));
  
})


app.get('*', function (req, res) {
  let slug = req.params[0] || ""
  slug = slug.replace(/^\//, "")
  res.sendFile(__dirname + '/index.html')
})




app.listen(5000, function () {
})

