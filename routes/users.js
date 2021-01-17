const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const userController = require('../controllers/usersController')

const auth = require('../util/auth')

router.use(bodyParser.urlencoded({limit: '10mb' , extended: true}))
router.use(bodyParser.json())

router.post('/login', userController.login)
router.post('/signup', userController.signUp)
router.get('/', auth, userController.getOwnDetail)
router.put('/', auth, userController.updateUserDetails)
router.patch('/image', auth, userController.uploadProfilePhoto)
router.get('/:username', userController.getUserDetails)

module.exports = router