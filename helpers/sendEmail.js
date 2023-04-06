require('dotenv').config()
const nodemailer = require('nodemailer')
const { BASE_URL } = process.env

const config = {
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
        user: 'postmaster@sandbox7db6176c9e8c4b0a83ea4bd57458f324.mailgun.org',
        pass: '07ea354a2260907d4e54fb8782f96e0c-81bd92f8-34993745',
    }
}
const transport = nodemailer.createTransport(config)

const sendEmail = async (user) => {

    const dataVerifyEmail = {
        to: user.email,

        from: "Mailgun Sandbox <postmaster@sandbox7db6176c9e8c4b0a83ea4bd57458f324.mailgun.org>",

        subject: 'Verify email',

        text: `Please, confirm your email: ${BASE_URL}/user/verify/${user.verificationToken}`,

        html: `<p> Please, confirm your email<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a></p>`,
    }

    try {
        const response = await transport.sendMail(dataVerifyEmail)
        console.log(response)

    } catch (error) {
        console.log(error.message)
    }
}
module.exports = sendEmail



