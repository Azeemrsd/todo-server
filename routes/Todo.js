const express = require("express");
const { sendResponse } = require("../utils/response");
const router = express.Router();
const { verifyToken } = require("../middleware/Validate");
const Todos = require("../Models/Todos");
// @desc /post-todo
// @route POST
// @result Add a new todo in the database

router.post("/post-todo", verifyToken, async (req, res) => {
  const newTodo = {
    todo: req.body.todo,
    isCompleted: false,
    username: req.user.username,
  };
  try {
    const todo = await Todos.create(newTodo);
    if (todo) {
      // upon success fetching all todos and sorting the latest first
      const allTodos = await Todos.find({
        username: req.user.username,
      }).sort({
        date: -1,
      });
      sendResponse(
        res,
        true,
        200,
        "Todo added successfully",
        "Todo has been added successfully!",
        allTodos
      );
    } else {
      sendResponse(
        res,
        false,
        400,
        "Add todo failed",
        "Something went wrong while adding todo."
      );
    }
  } catch (error) {
    sendResponse(res, false, 400, "Add todo failed", error.message);
  }
});

// @desc /fetch-all-todos
// @route GET
// @result Fetch all todos for the logged in user
router.get("/fetch-all-todos", verifyToken, async (req, res) => {
  //finding the todos and sorting the latest first
  try {
    const allTodos = await Todos.find({ username: req.user.username }).sort({
      date: -1,
    });
    if (allTodos) {
      sendResponse(
        res,
        true,
        200,
        "Todo Fetched successfully",
        "Todos fetched successfully",
        allTodos
      );
    } else {
      sendResponse(res, false, 200, "Todo Fetch failed", "Cannot fetch Todos");
    }
  } catch (error) {
    sendResponse(res, false, 400, "Todo Fetch failed", error.message);
  }
});

// @desc /delete-todo
// @route POST
// @result find todo by id and delete it

router.post("/delete-todo", async (req, res) => {
  const { _id } = req.body;
  try {
    const todo = await Todos.findByIdAndRemove(_id);
    if (todo) {
      sendResponse(
        res,
        true,
        200,
        "Delete success",
        "Todo Deleted Successfully"
      );
    } else {
      sendResponse(
        res,
        false,
        400,
        "Delete Failed",
        "Something went wrong while deleting todo"
      );
    }
  } catch (error) {
    sendResponse(res, false, 400, "Delete failed", error.message);
  }
});

// @desc /update-todo
// @route PUT
// @result find todo by id and update the todo text only
router.put("/update-todo", async (req, res) => {
  const { _id, todo } = req.body;
  try {
    const result = await Todos.findOneAndUpdate({ _id }, { todo });
    if (result) {
      //on success finding and sorting all todos
      const allTodosAfterUpdate = await Todos.find({
        username: req.body.username,
      }).sort({ date: -1 });
      sendResponse(
        res,
        true,
        200,
        "Update todo succeeded",
        "Successfully updated todo.",
        allTodosAfterUpdate
      );
    } else {
      sendResponse(res, false, 400, "Update Failed", "Update to failed!");
    }
  } catch (error) {
    sendResponse(res, false, 400, "Update Failed", error.message);
  }
});

// @desc /update-todo
// @route PUT
// @result find todo by id and update the isCompleted field
router.put("/mark-complete-todo", async (req, res) => {
  const { _id } = req.body;
  try {
    const todo = await Todos.findOneAndUpdate({ _id }, { isCompleted: true });
    if (todo) {
      sendResponse(
        res,
        true,
        200,
        "Update Success",
        "Successfully marked todo as completed."
      );
    } else {
      sendResponse(
        res,
        false,
        400,
        "Update Failed",
        "Error while marking todo as completed."
      );
    }
  } catch (error) {
    sendResponse(res, false, 400, "Update Failed", error.message);
  }
});

module.exports = router;
