require('dotenv').config()
const nodemailer = require('nodemailer')
const { BASE_URL, SENDGRID_USERNAME, SENDGRID_APIKEY, FROM } = process.env



const config = {
    service: 'SendGrid',
    auth: {
        user: SENDGRID_USERNAME,
        pass: SENDGRID_APIKEY,
    }
}
const transport = nodemailer.createTransport(config)

const sendEmail = async (user) => {

    const dataVerifyEmail = {
        to: user.email,

        from: `Admin <${FROM}>`,

        subject: 'Verify email',

        text: `Please, confirm your email: ${BASE_URL}/user/verify/${user.verificationToken}`,

        html: `<p> Please, confirm your email. <a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a></p>`,
    }

    try {
        const response = await transport.sendMail(dataVerifyEmail)
        console.log(response)

    } catch (error) {
        console.log(error.message)
    }
}
module.exports = sendEmail



