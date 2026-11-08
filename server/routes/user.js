const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// list and search
router.get('/', userController.view);
router.post('/', userController.find);

// export the user list
router.get('/export', userController.exportCsv);

// view and remove one user
router.get('/viewuser/:id', userController.viewOne);
router.get('/:id', userController.remove);

// add a user
router.get('/adduser', userController.form);
router.post('/adduser', userController.create);

// edit a user
router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);

module.exports = router;
