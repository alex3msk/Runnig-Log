const swaggerJsdoc = require('swagger-jsdoc');

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
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // path to API files
};

const specs = swaggerJsdoc(options);

module.exports = specs;