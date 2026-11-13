const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAccount, requireRole } = require("../middleware/auth");

// Everything here needs a signed-in account; changing users needs an editor.
router.use(requireAccount);

// list and search
router.get('/', userController.view);
router.post('/', userController.find);

// export the user list
router.get('/export', requireRole('editor'), userController.exportCsv);

// view and remove one user
router.get('/viewuser/:id', userController.viewOne);
router.get('/:id', requireRole('editor'), userController.remove);

// add a user
router.get('/adduser', requireRole('editor'), userController.form);
router.post('/adduser', requireRole('editor'), userController.create);

// edit a user
router.get('/edituser/:id', requireRole('editor'), userController.edit);
router.post('/edituser/:id', requireRole('editor'), userController.update);

module.exports = router;
