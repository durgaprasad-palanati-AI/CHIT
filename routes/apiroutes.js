let router = require('express').Router();
const Authentication = require('../auth');
const authentication = new Authentication()

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to chitworld',
    });
});

var routecontroller = require('./routecontrol');

router.post('/login',routecontroller.loggin);
router.get('/viewallchits',authentication.verifyToken,routecontroller.viewallchits);
router.get('/viewmembers',authentication.verifyToken,routecontroller.viewmembers);
router.put('/createmembers',authentication.verifyToken,routecontroller.createmembers);
router.put('/createchit',authentication.verifyToken,routecontroller.createchit);
router.post('/updatechit',authentication.verifyToken,routecontroller.updatechit);
router.post('/updatechitpayments',authentication.verifyToken,routecontroller.updatechitpayments);
router.post('/updateliftedchit',authentication.verifyToken,routecontroller.updateliftedchit);
router.delete('/deletechit',authentication.verifyToken,routecontroller.deletechit);

module.exports = router ;