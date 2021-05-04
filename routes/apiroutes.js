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
/* 
router.route('/login').post(routecontroller.loggin);
router.route('/viewallchits',authentication.verifyToken).get(routecontroller.viewallchits);
router.route('/viewmembers',authentication.verifyToken).get(routecontroller.viewmembers);
router.route('/createchit',authentication.verifyToken).put(routecontroller.createchit);
router.route('/updatechit',authentication.verifyToken).post(routecontroller.updatechit);
router.route('/deletechit',authentication.verifyToken).delete(routecontroller.deletechit);
 */
router.post('/login',routecontroller.loggin);
router.get('/viewallchits',authentication.verifyToken,routecontroller.viewallchits);

router.get('/viewmembers',authentication.verifyToken,routecontroller.viewmembers);
router.put('/createchit',authentication.verifyToken,routecontroller.createchit);
router.post('/updatechit',authentication.verifyToken,routecontroller.updatechit);
router.delete('/deletechit',authentication.verifyToken,routecontroller.deletechit);
module.exports = router ;