const express = require('express')
const app = express()

app.use(express.static('wwwroot'))

app.get('*', function (req, res) {
  console.log(req.params)
  let slug = req.params[0] || ""
  slug = slug.replace(/^\//, "")
  res.send(`<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Hello React!</title>
        <link rel="stylesheet" href="http://localhost:5000/css/site.css" />
    </head>
    <body>
      <div id="react-content"></div>

        <!-- Main -->
      <script src="http://localhost:5000/js/site.js"></script>
      <script>
        app.HomePage_to("${slug}", "react-content")
      </script>
    </body>
</html>
`)
})

app.listen(5000, function () {
})
