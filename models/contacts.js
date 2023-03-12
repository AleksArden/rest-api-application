const fs = require('fs/promises')

/**
 * get list of contacts
 * @returns {contacts<Array>}
 */
const listContacts = async () => {
  try {
    const contacts = JSON.parse(await fs.readFile('./models/contacts.json'))

    return contacts

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
    const contacts = JSON.parse(await fs.readFile('./models/contacts.json'))

    return contacts.find(({ id }) => id === contactId)

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
    const contacts = JSON.parse(await fs.readFile('./models/contacts.json'))

    const newContacts = contacts.filter(({ id }) => id !== contactId)

    await fs.writeFile('./models/contacts.json', JSON.stringify(newContacts))

  } catch (error) {
    console.log(error)
  }
}

/**
 * create new contact
 * @param {contact<Object>}
 */
const addContact = async (body) => {
  try {
    const contacts = JSON.parse(await fs.readFile('./models/contacts.json'))

    contacts.push(body)

    await fs.writeFile('././models/contacts.json', JSON.stringify(contacts))

  } catch (error) {
    console.log(error)
  }
}

/**
 * update contact
 * @param {Contact<Object>}
 * @param {id<string>}
 * @returns {contact<Object>}
 */
const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body

    const contacts = JSON.parse(await fs.readFile('./models/contacts.json'))

    const contact = contacts.find(({ id }) => id === contactId)

    contact.name = name
    contact.email = email
    contact.phone = phone

    const contactIdx = contacts.findIndex(({ id }) => id === contactId)
    contacts[contactIdx] = contact

    await fs.writeFile('./models/contacts.json', JSON.stringify(contacts))

    return contact
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
}
