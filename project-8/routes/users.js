var express = require('express');
var router = express.Router();

const controllerUser = require('../controllers/users')
router.get('/users/get', controllerUser.getAllUser)
router.post('/users/register', controllerUser.inputUser)
router.put('/users/edit/:id', controllerUser.modifiedUser)
router.delete('/users/delete/:id', controllerUser.dropUser)

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
