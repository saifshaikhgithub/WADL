const mongoose = require('mongoose');

const transectionSchema = new mongoose.Schema(
  {
    userid:{
        type:String,
        required:true,
    },
    amount: {
      type: Number,
      required: [true, "amount is required, cannot be kept empty"],
    },
    type:{
        type:String,
        required:[true,"type is req"]
    },
    category: {
      type: String,
      required: [true, "Category is required, cannot be kept empty"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    date: {
      type: Date,
      required: [true, "data is required"],
    },
  },
  { timestamps: true }
);

const transectionModel = mongoose.model('transections', transectionSchema);
module.exports = transectionModel;
