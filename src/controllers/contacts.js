import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  patchContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
	const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(200).send({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user._id,
  });

  res.status(201).send({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await updateContact(contactId, {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  });

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(200).send({
    status: 200,
    message: `Successfully upserted a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await patchContact(contactId, {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  });

  if (!result) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(200).send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: req.body,
  });
};
