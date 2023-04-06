const express = require('express')

const { checkValidateUser,
    compareEmailUsers,
    checkValidationLogin,
    protect,
    uploadUserAvatar,
    checkVerificationToken,
    checkResendVerifyEmail } = require('../../middlewares/userMiddleware')

const { registration,
    login,
    verifyEmail,
    logout,
    currentUser,
    updateUserAvatar, resendVerifyEmail } = require('../../controllers/usersControllers')

const router = express.Router()

router.route('/register')
    .post(checkValidateUser, compareEmailUsers, registration)

router.route('/verify/:verificationToken')
    .get(checkVerificationToken, verifyEmail)

router.route('/verify')
    .post(checkResendVerifyEmail, resendVerifyEmail)

router.route('/login')
    .post(checkValidateUser, checkValidationLogin, login)

router.use(protect)

router.route('/logout')
    .post(logout)

router.route('/current')
    .post(currentUser)

router.route('/avatars')
    .patch(uploadUserAvatar, updateUserAvatar)



module.exports = router