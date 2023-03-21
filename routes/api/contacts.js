const express = require('express')

const { getListContacts, getContactById, createContact, deleteContact, putContact, patchContact } = require('../../controllers/contactsControllers.js')

const { checkValidateContactFields, checkHasBodyPutContact, checkContactId, checkBodyPatchContact, checkHasFieldFavorite } = require('../../middlewares/contactMiddleware.js')

const router = express.Router()

router.route('/')
  .get(getListContacts)
  .post(checkHasFieldFavorite, checkValidateContactFields, createContact)

router.use('/:contactId', checkContactId)

router.route('/:contactId')
  .get(getContactById)
  .delete(deleteContact)
  .put(checkHasBodyPutContact, checkValidateContactFields, putContact)

router.route('/:contactId/favorite')
  .patch(checkBodyPatchContact, patchContact)

module.exports = router
