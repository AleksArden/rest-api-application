const express = require('express')

const { checkValidateUser,
    compareEmailUsers,
    checkValidationLogin,
    protect } = require('../../middlewares/userMiddleware')

const { registration,
    login,
    logout,
    currentUser } = require('../../controllers/usersControllers')

const router = express.Router()

router.route('/register')
    .post(checkValidateUser, compareEmailUsers, registration)

router.route('/login')
    .post(checkValidateUser, checkValidationLogin, login)

router.route('/logout')
    .post(protect, logout)

router.route('/current')
    .post(protect, currentUser)



module.exports = router