const Task = require("../models/task.model.js");

exports.create = (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({
      message: "Title cannot be empty",
    });
  }

  const task = new Task({
    title: req.body.title || "Untitled title",
  });

  task
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "some error while creating task",
      });
    });
};

exports.findAll = (req, res) => {
  Task.find()
    .then((tasks) => {
      res.send(tasks);
    })
    .catch((err) => {
      res.status(500).send({
        message: "something went wrong",
      });
    });
};

exports.getTodoList = async(req, res)=>{
  try {
    const page = parseInt(req.params.page) || 1; 
    const limit = parseInt(req.params.limit) || 5; 

    const skip = (page - 1) * limit;
    const total = await Task.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const tasks = await Task.find().skip(skip).limit(limit);

    res.json({
      tasks,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.findOne = (req, res) => {
  Task.findById(req.params.taskId)
    .then((task) => {
      if (!task) {
        return res.status(404).send({
          message: "Task not found with id" + req.params.taskId,
        });
      }
      res.send(task);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        res.status(404).send({
          message: "Task not found with id" + req.params.taskId,
        });
      }
      res.status(500).send({
        message: "Error retriving task with id" + req.params.taskId,
      });
    });
};

exports.update = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({
      message: "Title cannot be empty",
    });
  }
  Task.findByIdAndUpdate(
    req.params.taskId,
    {
      title: req.body.title || "Untitled title",
    },
    { new: true }
  )
    .then((task) => {
      if (!task) {
        return res.status(404).send({
          message: "Task not found with id" + req.params.taskId,
        });
      }
      res.send(task);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Task not found with id " + req.params.taskId,
        });
      }
      return res.status(500).send({
        message: "Error updating task with id " + req.params.taskId,
      });
    });
};

exports.delete = (req, res) => {
  Task.findByIdAndRemove(req.params.taskId)
    .then((task) => {
      if (!task) {
        res.status(404).send({
          message: "Task not found with id " + req.body.taskId,
        });
      }
      res.send({ message: "Task deleted successfully" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Task not found with id" + req.params.taskId,
        });
      }
      return res.status(500).send({
        message: "Task cannot deleted with id" + req.params.taskId,
      });
    });
};
