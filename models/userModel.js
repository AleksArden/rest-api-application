const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto')

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },

    verify: {
        type: Boolean,
        default: false,
    },

    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
        nullable: true,
    },

    avatarURL: String,

    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },

    token: String

},
    { versionKey: false },
)

userSchema.pre('save', async function (next) {

    if (this.isNew) {
        const emailHash = crypto.createHash('md5').update(this.email).digest('hex')
        this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=monsterid`
    }

    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash)

const User = model('User', userSchema)

module.exports = User