const express = require('express')

const { getListContacts, getContactById, createContact, deleteContact, putContact } = require('../../controllers/contactsControllers.js')

const { chekContactFields, chekHasBodyContact, checkContactId } = require('../../middlewares/contactMiddleware.js')

const router = express.Router()

router.route('/')
  .get(getListContacts)
  .post(chekHasBodyContact, chekContactFields, createContact)

router.route('/:contactId')
  .get(checkContactId, getContactById)
  .delete(checkContactId, deleteContact)
  .put(chekHasBodyContact, chekContactFields, checkContactId, putContact)

module.exports = router
