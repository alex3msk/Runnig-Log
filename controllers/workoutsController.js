const { User, Workout, Shoe, WorkoutType, LoadLevel } = require("../models/index");

const HttpError = require("../services/HttpError");


// get Workout by its Id
// fetch refernce data from linked tables/models - User name, Load Level name, Shoe model, WorkoutType name
const getting = async (req, res, next) => {
  try {
    const id = req.params.id;
    const workout = await Workout.findByPk(id, {
      include: [
        {
          model: User, attributes: ["name"],
        },
        {
          model: LoadLevel, attributes: ["name"],
        },
        {
          model: Shoe, attributes: ["model"],
        },
        {
          model: WorkoutType, attributes: ["name"],
        },
      ],
    });

    if (!workout) {
      return next(new HttpError("Couldn't find Workout by Id", 404));
    }
    res.status(200).json(workout);
  } catch (err) {
    next(err);
  }
};


// select all Workouts
const gettingAll = async (req, res, next) => {
  try {
    const workouts = await Workout.findAll();

    if (workouts.length === 0) {
      return res.status(200).json("No workouts found.");
    }
    res.status(200).json(workouts);
  } catch (err) {
    next(err);
  }
};


// create a new Workout record
const creating = async (req, res, next) => {
  try {
    const { wdate, distance, wtime, description, height, avgpulse, maxpulse,
      UserId, ShoeId, LoadLevelId, WorkoutTypeId } = req.body;

    console.log("Creating workout: ", wdate, description, distance, wtime, UserId);
    // check min required fields
    if (!wdate || !description || !distance || !wtime || !UserId) {
      return next(new HttpError("Not enough data for creating workout", 400));
    }
    // chack if there is a User record with given userId
    const user = await User.findByPk(UserId);
    if (!user) {
      return next(new HttpError("Couldn't find User with given Id", 404));
    }
    // check shoeId - can be Null or should reference existing object
    if ( ShoeId ) {
      const shoe =  await Shoe.findByPk(ShoeId);
      if (!shoe) {
        return next(new HttpError("Couldn't find Shoe with given Id", 404));
      }
    }
    // check loadlevelId - can be Null or should reference existing object
    if ( LoadLevelId ) {
      const level =  await LoadLevel.findByPk(LoadLevelId);
      if (!level) {
        return next(new HttpError("Couldn't find Load Level with given Id", 404));
      }
    }
    // check workouttypeId - can be Null or should reference existing object
    if ( WorkoutTypeId ) {
      const woType =  await LoadLevel.findByPk(WorkoutTypeId);
      if (!woType) {
        return next(new HttpError("Couldn't find Workout Type with given Id", 404));
      }
    }

    // OK - insert a new Workout record
    const wo = await Workout.create({
      wdate: wdate, 
      distance: distance, 
      wtime: wtime, 
      description: description, 
      height: height, 
      avgpulse: avgpulse, 
      maxpulse: maxpulse,
      UserId: UserId, 
      ShoeId: ShoeId, 
      LoadLevelId: LoadLevelId, 
      WorkoutTypeId: WorkoutTypeId,
    });

    res.status(201).json(wo);
  } catch (err) {
    next(new HttpError("Couldn't create Workout record. " + err, 404));
  }
};

// update Workout record
const updating = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { wdate, distance, wtime, description, height, avgpulse, maxpulse,
      UserId, ShoeId, LoadLevelId, WorkoutTypeId } = req.body;

    // check required fields
    if (!wdate || !description || !distance || !wtime || !UserId) {
      return next(new HttpError("Not enough data for updating workout", 400));
    }
    // chack if there is a User record with given userId
    const user = await User.findByPk(UserId);
    if (!user) {
      return next(new HttpError("Couldn't find User with given Id", 404));
    }
    // check shoeId - can be Null or should reference existing object
    if ( ShoeId ) {
      const shoe =  await Shoe.findByPk(ShoeId);
      if (!shoe) {
        return next(new HttpError("Couldn't find Shoe with given Id", 404));
      }
    }
    // check loadlevelId - can be Null or should reference existing object
    if ( LoadLevelId ) {
      const level =  await LoadLevel.findByPk(LoadLevelId);
      if (!level) {
        return next(new HttpError("Couldn't find Load Level with given Id", 404));
      }
    }
    // check workouttypeId - can be Null or should reference existing object
    if ( WorkoutTypeId ) {
      const woType =  await LoadLevel.findByPk(WorkoutTypeId);
      if (!woType) {
        return next(new HttpError("Couldn't find Workout Type with given Id", 404));
      }
    }

    // OK - insert a new Workout record
    const wo_updated = await Workout.update( {
        wdate: wdate, 
        distance: distance, 
        wtime: wtime, 
        description: description, 
        height: height, 
        avgpulse: avgpulse, 
        maxpulse: maxpulse,
        UserId: UserId, 
        ShoeId: ShoeId, 
        LoadLevelId: LoadLevelId, 
        WorkoutTypeId: WorkoutTypeId,
      },
      {
        where: { id },
      }
    );

    res.status(201).json(wo_updated);
  } catch (err) {
    next(new HttpError("Couldn't update Workout record. " + err, 404));
  }
};


// delete Workout by Id
const deleting = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deleted = await Workout.destroy({ where: { id } });

    if (deleted === 0) {
      return next(new HttpError("Workout not found or could not be deleted", 404));
    }
    res.status(200).json("Deleted successfully");
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getting,
  gettingAll,
  deleting,
  creating,
  updating,
};
