const swaggerJsdoc = require('swagger-jsdoc');

const path = require('path');
require("dotenv").config({path: path.join(__dirname, '../.env')});

const PORT = process.env.PORT;
let swaggerUrl = "127.0.0.1:" + PORT.toString();


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Runing Log API',
      version: '1.0.0',
      description: 'Training Log system for running club to manage training logs and deliver statistics for club members.',
    },
    servers: [
      {
        url: swaggerUrl, // 'http://localhost:3000', 
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // path to API files
};

const specs = swaggerJsdoc(options);

module.exports = specs;