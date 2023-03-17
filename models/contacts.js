const Contact = require('./contactModel')

/**
 * get list of contacts
 * @returns {contacts<Array>}
 */
const listContacts = async () => {
  try {
    return await Contact.find()

  } catch (error) {
    console.log(error)
  }
}

/**
 * get contact by ID
 * @param {id<string>}
 * @returns {contact<Object>}
 */
const getById = async (contactId) => {
  try {
    return await Contact.findById(contactId)

  } catch (error) {
    console.log(error)
  }
}

/**
 *  delete contact
 * @param {id<string>}
 */
const removeContact = async (contactId) => {
  try {
    await Contact.findByIdAndDelete(contactId)

  } catch (error) {
    console.log(error)
  }
}

/**
 * create new contact
 * @param {contact<Object>}
 * @returns {contact<Object>}
 */
const addContact = async (body) => {
  try {
    return await Contact.create(body)

  } catch (error) {
    console.log(error)
  }
}

/**
 * put update contact
 * @param {Contact<Object>}
 * @param {id<string>}
 * @returns {contact<Object>}
 */
const updateContact = async (contactId, body) => {
  try {
    return await Contact.findByIdAndUpdate(contactId, body, { new: true })

  } catch (error) {
    console.log(error)
  }
}

/**
 * patch update contact
 * @param {id<string>} contactId 
 * @param {contact<Object>} body 
 * @returns {contact<Object>}
 */
const updateStatusContact = async (contactId, body) => {
  try {

    return await Contact.findByIdAndUpdate(contactId, body, { new: true })

  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}
