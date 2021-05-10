const {Router} = require('express');
// import controller from './controllers'
const {subscribe, publish} = require('../controllers/notification')


const router = Router()

router.route('/subscribe/:topic').post(subscribe)
router.route('/publish/:topic').post(publish)

module.exports = router;