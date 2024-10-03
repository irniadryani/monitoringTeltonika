const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const clientRoutes = require('./src/routes/clientRoutes');
const addressRoutes = require('./src/routes/addressRoutes');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        `http://localhost:${port}`,
        "http://localhost:3000",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); 
      } else {
        callback(new Error("Not allowed by CORS")); 
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
);

app.use('/api', clientRoutes);
app.use('/api', addressRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});