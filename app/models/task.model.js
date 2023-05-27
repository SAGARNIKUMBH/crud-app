const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema(
  {
    title: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Todo", TodoSchema);
