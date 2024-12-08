const { Weight } = require("../models/index");
const HttpError = require("../services/HttpError");



// get User by its Id
const getting = async (req, res, next) => {
  try {
    const id = req.params.id;
    const weight = await Weight.findByPk(id);
    if (!weight) {
      return next(new HttpError("Couldn't find weight record by Id", 404));
    }
    res.status(200).json(weight);
  } catch (err) {
    next(err);
  }
};

// select all User's weight records
const gettingAll = async (req, res, next) => {
  try {
    const weights = await Weight.findAll();
    if (!weights || weights.length === 0) {
      return next(new HttpError("No user's weight records found", 404));
    }
    res.status(200).json(weights);
  } catch (err) {
    next(err);
  }
};

// create a new User's weight record
// const creating = async (req, res, next) => {
//   try {
//     console.log(req.body);
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//       next(new HttpError("Not enough data for creating user", 400));
//     }
//     if (!passwordREGX.test(password)) {
//       next(new HttpError("Validation error: password not strong", 404));
//     }
//     const newPassword = await bcrypt.hash(password, saltRounds);
//     const user = await User.create({
//       name: name,
//       email: email,
//       password: newPassword,
//     });
//     if (!user) {
//       next(new HttpError("Problem creating user", 500));
//     }
//     res.status(200).json(user);
//   } catch (err) {
//     next(err);
//   }
// };

// // udpate User record
// const updating = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const { name, email, password } = req.body;
//     console.log(name, email);
//     const newPassword = await bcrypt.hash(password, saltRounds);
    
//     const [updated] = await User.update(
//       { name: name, email: email, password: newPassword }, 
//       {
//         where: { id },
//       }
//     );
//     if ( updated === 0 ) {
//       return next(new HttpError("User not found or update failed", 404));
//     }
//     res.status(200).json("Updated successfully");
//   } catch (err) {
//     next(err);
//   }
// };

// delete Weight records
const deleting = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await Weight.destroy({ where: { id } });
    if (deleted === 0) {
      return next(new HttpError("Weight not found or deletion failed", 404));
    }
    res.status(200).json("Weight record deleted successfully");
  } catch (err) {
    next(err);
  }
};

// get all User's Weight records

// get Weight record by date



module.exports = {
  getting,
  gettingAll,
//  updating,
  deleting,
//  creating,
  //allOrdersUser,
};
