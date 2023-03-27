const catchAsync = require('../helpers/catchAsync')
const { listContacts, getById, addContact, removeContact, updateContact, updateStatusContact } = require("../models/contacts")

/**
 * get list of contacts
 * @param {user<object>}
 * @param {query<Object>}
 */
const getListContacts = catchAsync(async (req, res) => {
    const { limit, page, favorite } = req.query
    const pagPage = +page || 1
    const pagLimit = +limit || 20
    const skip = (pagPage - 1) * pagLimit

    const dataQuery = { skip, pagLimit, favorite: Boolean(favorite) }

    const contacts = await listContacts(req.user, dataQuery)

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

    const dataContact = {
        owner: req.user._id,
        ...req.body
    }

    const newContact = await addContact(dataContact)

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
 *put update contact
 * @param {Contact<Object>}
 * @param {id<string>}
 */
const putContact = catchAsync(async (req, res) => {
    const { contactId } = req.params
    const body = req.body

    const newContact = await updateContact(contactId, body)

    res.status(200).json(newContact)
})
/**
 * patch update contact
 *  @param {Contact<Object>}
 * @param {id<string>}
 */
const patchContact = catchAsync(async (req, res) => {
    const { contactId } = req.params
    const body = req.body


    const editContact = await updateStatusContact(contactId, body)

    res.status(200).json(editContact)
})

module.exports = {
    getListContacts,
    getContactById,
    createContact,
    deleteContact,
    putContact,
    patchContact,
}