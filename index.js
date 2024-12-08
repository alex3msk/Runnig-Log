
const path = require('path');
require("dotenv").config({path: path.join(__dirname, '.env')});
const PORT = process.env.PORT;

const dbManager = require("./db/database");
const { initTables, loadTestData } = require("./db/loadTestData");

const app = require("./utils/app");

// using EJS as html templating engine
const ejs = require('ejs');
app.set('view engine','ejs');

// Parse command line  
// If --init flag is On - init Database, create and fill in the tables with test data and exit
const { Command } = require('commander');
const program = new Command();

program
  .version('1.0.0')
  .option('-i, --init', 'Initialize the database')
  .option('-d, --data <filename>', 'Load test data')
  .parse(process.argv);

const options = program.opts();

if ( options.init ) {
  console.log('Initializing database...');
  dbManager
    .authenticate()
    .then(() => dbManager.sync())
    .then(() => console.log("Database sync."))
    .then(() => initTables())
    .catch((err) => {
      console.log(err);
    });
  return;
} 

// load (test) data from csv file
if ( options.data ) {
  console.log('Loading test data...');
  dbManager
    .authenticate()
    .then(() => dbManager.sync())
    .then(() => console.log("Database sync."))
    .then(() => loadTestData(options.data))
    .catch((err) => {
      console.log(err);
    });
  return;
} 

//********************
// Main entry point
//********************
dbManager
  .authenticate()
  .then(() => dbManager.sync())
  .then(() => {
    console.log("Databases sync");
    app.listen(PORT);
  })
  .then(() => console.log("Running Log app listening on port ", PORT))
  .catch((err) => {
    console.log(err);
  });





