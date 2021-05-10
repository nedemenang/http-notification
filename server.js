const express = require('express');
const morgan = require('morgan');
const routes = require('./routes/notification');
const PORT = process.env.PORT || 3128 ;
const app = express();

app.use(express.json());

if (process.env.NODE_ENV == "development") {
  app.use(morgan('dev'))
}

app.use('/', routes)

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Our HTTP Notifier</h1>");
  });

const server = app.listen(PORT, () => {
    console.log(`We are live on ${PORT}`);
});


process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });

  exports.app = app
  