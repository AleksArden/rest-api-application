const Contact = require("../models/contactModel");
const { Types } = require("mongoose");
const catchAsync = require("../helpers/catchAsync");

const {
    dataValidatorCreate,
    validatorFavoriteField,
} = require("../helpers/contactValidator");

/**
 * Check body has data
 * @param {Contact<Object>}
 * @returns {Object}
 */
const checkHasBodyPutContact = (req, res, next) => {

    if (!Object.keys(req.body).length) {
        res.status(400).json({ message: "missing fields" });
        return;
    }
    next();
};

/**
 * Check body patch has wrong field favorite
 * @param {Object}
 * @returns {Object}
 */
const checkBodyPatchContact = (req, res, next) => {

    if (!Object.keys(req.body).length) {
        res.status(400).json({ message: "missing field favorite" });
        return;
    }
    const { error, value } = validatorFavoriteField(req.body);

    if (error) {
        res.status(400).json({ message: `${error.details[0].message}` });
    }
    req.body = value;
    next();
};

/**
 * Check has fields of contact and check has favorite field
 * @param {contact<Object>}
 * @returns {Object}
 */
const checkHasFieldFavorite = (req, res, next) => {
    const body = req.body;

    if (!Object.keys(body).length) {
        res.status(400).json({ message: "missing fields" });
        return;
    }

    const favorite = Object.keys(body).includes("favorite");
    if (!favorite) {
        body.favorite = false;
    }
    req.body = body;
    next();
};

/**
 * Validates fields
 * @param {Contact<Object>} 
 * @returns {Object}
 */
const checkValidateContactFields = (req, res, next) => {

    const { error } = dataValidatorCreate(req.body);
    if (error) {

        if (error.details[0].context.limit) {
            res.status(400).json({ message: "name length must be at least 3 characters long and less than or equal to 24 characters long" });
            return;
        }
        if (error.details[0].context.value) {
            res.status(400).json({ message: `${error.details[0].message}` });
            return;
        }
        res.status(400).json({ message: `missing required ${error.details[0].context?.key} field` });
        return;
    }

    next();
};

/**
 * Validates id
 * @param {id<string>}
 * @returns {id<string>}
 */
const checkContactId = catchAsync(async (req, res, next) => {
    const { contactId } = req.params;

    const isIdValid = Types.ObjectId.isValid(contactId);

    if (!isIdValid) return res.status(404).json({ message: "Not found" });

    const contactExists = await Contact.exists({ _id: contactId });

    if (!contactExists) return res.status(404).json({ message: "Not found" });

    next();
});

module.exports = {
    checkValidateContactFields,
    checkHasBodyPutContact,
    checkContactId,
    checkBodyPatchContact,
    checkHasFieldFavorite,
};
