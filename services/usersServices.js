const User = require('../models/userModel')
const Jimp = require("jimp")
const fs = require('fs').promises

/**
 *  create user
 * @param {body<Object} 
 * @returns {user<Object>}
 */

const createUser = async (body) => {
    try {
        return await User.create(body)

    } catch (error) {
        console.log(error)
    }
}

/**
 * Get user by email
 * @param {email<string>}  
 * @returns {user<Object>}
 */

const getUser = async (email) => {
    try {
        return await User.findOne({ email })

    } catch (error) {
        console.log(error)
    }
}

/**
 * get user by id
 * @param {id<string>}  
 * @returns {user<Object}
 */

const getUserbyId = async (id) => {
    try {
        return User.findById(id)

    } catch (error) {
        console.log(error)
    }
}

/**
 * update token
 * @param {id<string>} 
 * @param {token<string>}  
 */

const refreshToken = async (id, token) => {
    await User.findByIdAndUpdate(id, { token: token })
}

/**
 *  moving and editing a file
 * @param {string} tmpUpload 
 * @param {string} publicUpload 
 */

const moveAndEditFile = async (tmpUpload, publicUpload) => {
    try {
        await fs.rename(tmpUpload, publicUpload)
        Jimp.read(publicUpload)
            .then((img) => {
                return img
                    .resize(250, 250)
                    .quality(60)
                    .write(publicUpload)

            })
    } catch (error) {
        await fs.unlink(tmpUpload)
        console.log(error)
    }
}

module.exports = {
    createUser,
    getUser,
    getUserbyId,
    refreshToken,
    moveAndEditFile
}