const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');
require("dotenv").config({path: path.join(__dirname, '../.env')});
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const { User, Workout, Shoe, Start, Weight, WorkoutType, LoadLevel } = require("../models");

// const dbManager = require("../db/database");

//***********************************
// Create and populate the database
//***********************************
const initTables = async () => {
    // create Users
    let newPassword = await bcrypt.hash("1234qwerty", saltRounds);
    const user1 = await User.create({
        name: "John Smith",
        email: "johnsmith@gmail.com",
        password: newPassword, 
        dob: "1985-10-01",
    });
    newPassword = await bcrypt.hash("1234qwerty", saltRounds);
    await User.create({
        name: "Peter Pen",
        email: "peterpen@yahoo.com",
        password: newPassword,
        dob: "1992-05-12",
    });

    // create load levels
    const level1 = await LoadLevel.create({
        name: "Easy",
        color: "Green",
        });
    const level2 = await LoadLevel.create({
        name: "Moderate",
        color: "Yellow",
        });
    const level3 = await LoadLevel.create({
        name: "High",
        color: "Red",
        });

    // create workout types
    const wtype1 = await WorkoutType.create({ name: "Road", });
    const wtype2 = await WorkoutType.create({ name: "Trail", });
                   await WorkoutType.create({ name: "Mixed", });

    // create weight records
    // await Weight.create({ weight: 84.0, wdate: "2024-10-10", UserId: user1.id, });
    // await Weight.create({ weight: 83.5, wdate: "2024-10-20", UserId: user1.id, });
    // await Weight.create({ weight: 83.2, wdate: "2024-10-30", UserId: user1.id, });
    // await Weight.create({ weight: 84.2, wdate: "2024-11-10", UserId: user1.id, });

    // create shoes
    const shoe1 = await Shoe.create({
        brand: "Nike",
        model: "Vomero 17",
        size: "US 10.5",
        price: 100,
        purchased: "2024-04-10",
        firstuse: "2024-05-01",
        photo: "nike-vomero-17.jpg",
    });
    const shoe2 = await Shoe.create({
        brand: "Nike",
        model: "Pegasus 41",
        size: "US 10.5",
        price: 90,
        purchased: "2024-03-01",
        firstuse: "2024-07-01",
        photo: "nike-pegasus-41.jpg",
    });
    await Shoe.create({
        brand: "HOKA",
        model: "Mach 6",
        size: "US 11",
        price: 100,
        purchased: "2024-03-01",
        firstuse: "2024-07-01",
        photo: "hoka-mach-6.jpg",
    });
    await Shoe.create({
        brand: "HOKA",
        model: "Ricket X2",
        size: "US 11",
        price: 180,
        purchased: "2024-03-01",
        firstuse: "2024-07-01",
        photo: "hoka-rocket-x2.jpg",
    });


    // create start
    // await Start.create( {
    //     startdate: "2024-12-10",
    //     distance: 41.2,
    //     description: "Malaga Marathon",
    //     UserId: user1.id,
    //     WorkoutId: null,
    // } );

    // create test Workout records
    // await Workout.create({ 
    //     wdate: "2024-06-25",
    //     distance: 8,
    //     wtime: 45,
    //     description: "Easy run",
    //     height: 0,
    //     avgpulse: 130,
    //     maxpulse: null,
    //     UserId: user1.id,
    //     ShoeId: shoe1.id,
    //     LoadLevelId: level1.id,
    //     WorkoutTypeId: wtype1.id,
    // });await Workout.create({ 
    //     wdate: "2024-06-30",
    //     distance: 10.7,
    //     wtime: 61,
    //     description: "Easy run",
    //     height: 0,
    //     avgpulse: 130,
    //     maxpulse: null,
    //     UserId: user1.id,
    //     ShoeId: shoe2.id,
    //     LoadLevelId: level1.id,
    //     WorkoutTypeId: wtype1.id,
    // });
    // await Workout.create({ 
    //     wdate: "2024-07-02",
    //     distance: 12,
    //     wtime: 70,
    //     description: "Moderate run",
    //     height: 0,
    //     avgpulse: 135,
    //     maxpulse: null,
    //     UserId: user1.id,
    //     ShoeId: shoe1.id,
    //     LoadLevelId: level2.id,
    //     WorkoutTypeId: wtype2.id,
    // });
    // await Workout.create({ 
    //     wdate: "2024-07-04",
    //     distance: 10.5,
    //     wtime: 50,
    //     description: "Tempo run, high pulse",
    //     height: 100,
    //     avgpulse: 145,
    //     maxpulse: 160,
    //     UserId: user1.id,
    //     ShoeId: shoe1.id,
    //     LoadLevelId: level3.id,
    //     WorkoutTypeId: wtype1.id,
    // });
    // await Workout.create({ 
    //     wdate: "2024-07-12",
    //     distance: 15,
    //     wtime: 75,
    //     description: "Tempo run, high pulse",
    //     height: 100,
    //     avgpulse: 154,
    //     maxpulse: 160,
    //     UserId: user1.id,
    //     ShoeId: shoe2.id,
    //     LoadLevelId: level3.id,
    //     WorkoutTypeId: wtype1.id,
    // });
    // await Workout.create({ 
    //     wdate: "2024-07-14",
    //     distance: 12,
    //     wtime: 62,
    //     description: "Moderate run",
    //     height: 100,
    //     avgpulse: 135,
    //     maxpulse: 140,
    //     UserId: user1.id,
    //     ShoeId: shoe2.id,
    //     LoadLevelId: level3.id,
    //     WorkoutTypeId: wtype1.id,
    // });

    console.log("Tables initialised.");
};

// load test data from CSV file
// record format:
// wdate - wtime - distance - LoadLevel - avgpulse - weight - shoeID
const loadTestData = async (filename) => {
    if ( filename.length === 0 ) {
        console.log("Cannot load data. Please, enter valid file name");
        return;
    }
    console.log("Loading data from ", filename);
    const USER_ID = 1; // eneter data for this user

    const filePath = path.join(__dirname, '.', filename);
    const allFileContents = fs.readFileSync(filePath, 'utf-8');
    const parsedData = allFileContents.split(/\r?\n/).map(line => {
        return line.split(';');
    });
    
    let counter = 0;
    parsedData.forEach( line => {
        if ( line[1] && line[2] ) {
            let [ hh, mm ] = line[1].split(":");
            Workout.create({ 
                wdate: line[0],
                wtime: parseInt(hh)*60 + parseInt(mm),
                distance: parseFloat(line[2]),
                LoadLevelId: parseInt(line[3]),
                description: "n/a",
                avgpulse: parseInt(line[4]),
                ShoeId: parseInt(line[6]),
                height: 0,
                maxpulse: null,
                UserId: USER_ID,
                WorkoutTypeId: 1,
            });
            ++counter;
        }
        if ( line[5] ) {
            // add weight record
             Weight.create({ weight: parseFloat(line[5]), wdate: line[0], UserId: USER_ID, });
        }
    });
    
    console.log("WO records added: ", counter);
    console.log("Data loaded.");
    return;
}


module.exports = { initTables, loadTestData };
