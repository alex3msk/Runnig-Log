const { Shoe, User, Workout } = require("../models/index");
const HttpError = require("../services/HttpError");
const { Op, fn, col } = require('sequelize');


// select OrderItem by Id
const getting = async (req, res, next) => {
  try {
    const id = req.params.id;
    const shoe = await Shoe.findByPk(id, {
      include: [
        {
          model: Workout,
          attributes: [
            [fn('SUM', col('distance')), 'totalDistance']
          ],
        } ]
    } );
    if ( !shoe ) {
      return next(new HttpError("Couldn't find Shoe by Id", 404));
    }
    res.status(200).json(shoe);
  } catch (err) {
    next(err);
  }
};

// select all OrderItems for all Orders
const gettingAll = async (req, res, next) => {
  try {
    const shoes = await Shoe.findAll();
    if (!shoes || shoes.length === 0) {
      return next(new HttpError("No order shoes", 404));
    }
    res.status(200).json(shoes);
  } catch (err) {
    next(err);
  }
};

// create a new Shoe record
const creating = async (req, res, next) => {
  try {
    const { brand, model, size, price, purchased, firstuse, UserId } = req.body;
    if (!brand || !model || !size || !UserId) {
      return next(new HttpError("Not enough data for creating Shoe record", 400));
    }
    // chack if there is a User record with given userId
    const user = await User.findByPk(UserId);
    if (!user) {
      return next(new HttpError("Couldn't find User with given Id", 404));
    }
    // insert a new Shoe record
    const shoe = await Shoe.create({ 
      brand: brand, model: model, size: size, 
      price: price, purchased: purchased, 
      firstuse: firstuse, UserId: UserId 
    });
    if (!shoe) {
      return next(new HttpError("Problem creating Shoe record", 500));
    }
    res.status(201).json(shoe); 
  } catch (err) {
    next(err);
  }
};

// update existing Shoe record
const updating = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { brand, model, size, price, purchased, firstuse, UserId } = req.body;

    if (!id || !brand || !model || !size || !UserId) {
      return next(new HttpError("Not enough data for updating Shoe record", 400));
    }
    // chack if there is a User record with given userId
    const user = await User.findByPk(UserId);
    if (!user) {
      return next(new HttpError("Couldn't find User with given Id", 404));
    }

    // update a Shoe record
    const [updated] = await Shoe.update({ 
        brand: brand, model: model, size: size, 
        price: price, purchased: purchased, 
        firstuse: firstuse, UserId: UserId 
      },
      {
        where: { id },
      }
    );
    if (updated === 0) {
      return next(new HttpError("Order item not found or no updates made", 404));
    }
    res.status(200).json("Updated successfully");
  } catch (err) {
    next(err);
  }
};

// delete Shoe record
const deleting = async (req, res, next) => {
  try {
    const id = req.params.id;

    // check ShoeId in Workouts table
    const wo = await Workout.findOne({ where: { ShoeId: id } });
    if ( wo ) {
      return res.status(500).json({ message: "Cannot delete Shoe record because it is associated with some workouts." });
    }    
    
    const deleted = await Shoe.destroy({ where: { id } });
    if (deleted === 0) {
      return next(
        new HttpError("Shoe record not found or could not be deleted", 404)
      );
    }
    res.status(200).json("Shoe record deleted successfully");
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getting,
  gettingAll,
  updating,
  deleting,
  creating,
};
