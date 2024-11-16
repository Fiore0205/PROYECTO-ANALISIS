var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.listen(6500, () => {
  console.log('Servidor Activo');
});

module.exports = router;
