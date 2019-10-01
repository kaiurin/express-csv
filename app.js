const express = require('express');
const app = express();
const indexRouter = require("./routes/index");

app.use('/', indexRouter);

// Start server
app.listen(3000);
