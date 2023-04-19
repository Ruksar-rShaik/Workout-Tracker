const mongoose = require('mongoose');
const workoutSessionModel = require("../Models/workoutSessionModel");
const userSchema = require("../Models/userModel");
const moment = require('moment');




const monthlyLeaderBoard= async (req, res) => {
    const now = moment(); // get current date using Moment.js
    const startOfMonth = moment().startOf('month'); // create start of month date
    const endOfMonth = moment().endOf('month'); // create end of month date
    
    try {
        const result = await workoutSessionModel.aggregate([
          // match workout sessions for a specific month
          {
            $match: {
              date: {
                $gte: startOfMonth.toDate(),
                $lt: endOfMonth.toDate(),
              },
              isDeleted: false 
            },
          },
          // group by user and sum total calories burned
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          // match only users whose isDeleted is false
          {
            $match: {
              "user.isDeleted": false
            }
          },
          // group by user and sum total calories burned
          {
            $group: {
              _id: "$userId", // group by user
              name: { $first: "$user.name" }, // get the user's name
              totalCaloriesBurned: { $sum: "$totalCaloriesBurn" }, // sum total calories burned
            },
          },
          // sort by total calories burned in descending order
          {
            $sort: {
              totalCaloriesBurned: -1,
            },
          },
        ]).exec();
      
        res.status(200).send({status:true, data:result})
      } catch (err) {
        res.status(500).send(err.message);
      }
      
  };




// Get weekly calories burned data for all users
 const weeklyLeaderBoard=async (req, res) => {
  try {

    
    const startOfWeek = moment().startOf('week'); // calculate start of current week
    const endOfWeek = moment().endOf('week'); // calculate end of current week
   

    const result = await workoutSessionModel.aggregate([
      // match workout sessions for current week
      {
        $match: {
          date: {
            $gte: startOfWeek.toDate(),
            $lt: endOfWeek.toDate(),
          },
          isDeleted:false
        },
      },
      // group by user and sum total calories burned
      {
        $lookup: {
          from: 'users', // name of the collection to join
          localField: 'userId', // field from workoutSessionModel collection
          foreignField: '_id', // field from users collection
          as: 'user', // name of the output field for the joined data
        },
      },
       // match only users whose isDeleted is false
       {
        $match: {
          "user.isDeleted": false
        }
      },
      // group by user and sum total calories burned
      {
        $group: {
          _id: "$userId", // group by user
          name: { $first: "$user.name" }, // retrieve user name from joined collection
          totalCaloriesBurned: { $sum: "$totalCaloriesBurn" }, // sum total calories burned
        },
      },
      
      {
        $project: {
          _id: 0,
          userName: "$name", // use the `name` field from the `$group` stage
          totalCaloriesBurned: 1,
        },
      },
      
      {
        $sort: {
          totalCaloriesBurned: -1,
        },
      },
    ]).exec();
    
    res.status(200).send({status:true, data:result});
  } catch (err) {
    res.status(500).send(err.message);
  }
};


module.exports={monthlyLeaderBoard,weeklyLeaderBoard}




//2023-04-15T15:18:31.780+00:00