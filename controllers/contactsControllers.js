const { v4: uuidv4 } = require('uuid')
const catchAsync = require('../helpers/catchAsync')
const { listContacts, getById, addContact, removeContact, updateContact } = require("../models/contacts")

/**
 * get list of contacts
 */
const getListContacts = catchAsync(async (_, res) => {

    const contacts = await listContacts()

    res.status(200).json(contacts)
})

/**
 * get contact by ID
 * @param {id<string>}
 */
const getContactById = catchAsync(async (req, res,) => {

    const { contactId } = req.params

    const contact = await getById(contactId)

    res.status(200).json(contact)
})

/**
 * create new contact
 * @param {contact<Object>}
 */
const createContact = catchAsync(async (req, res) => {
    const { name, email, phone } = req.body
    const newContact = {
        name,
        email,
        phone,
        id: uuidv4(),
    }
    await addContact(newContact)

    res.status(201).json(newContact)
})

/**
 *  delete contact
 * @param {id<string>}
 */
const deleteContact = catchAsync(async (req, res) => {
    const { contactId } = req.params

    await removeContact(contactId)

    res.status(200).json({ message: 'contact deleted' })
})

/**
 * update contact
 * @param {Contact<Object>}
 * @param {id<string>}
 */
const putContact = catchAsync(async (req, res) => {
    const { contactId } = req.params
    const body = req.body

    const newContact = await updateContact(contactId, body)

    res.status(200).json(newContact)
})

module.exports = {
    getListContacts,
    getContactById,
    createContact,
    deleteContact,
    putContact
}