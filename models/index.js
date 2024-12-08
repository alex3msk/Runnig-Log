const User = require("./User");
const Workout = require("./Workout");
const Shoe = require("./Shoe");
const LoadLevel = require("./LoadLevel");
const Start = require("./Start");
const Weight = require("./Weight");
const WorkoutType = require("./WorkoutType");


User.hasMany(Workout);
Workout.belongsTo(User);

User.hasMany(Shoe);
Shoe.belongsTo(User);

User.hasMany(Start);
Start.belongsTo(User);

Workout.hasOne(Start);
Start.belongsTo(Workout);

User.hasMany(Weight);
Weight.belongsTo(User);

Shoe.hasMany(Workout);
Workout.belongsTo(Shoe);

LoadLevel.hasMany(Workout);
Workout.belongsTo(LoadLevel);

WorkoutType.hasMany(Workout);
Workout.belongsTo(WorkoutType);

module.exports = { User, Workout, Shoe, LoadLevel, Start, Weight, WorkoutType };
