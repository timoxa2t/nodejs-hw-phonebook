const fs = require("fs/promises");
const path = require("path");
const uuid = require("uuid");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/),
});

const fileName = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(fileName);
  return JSON.parse(contacts.toString());
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const findedContact = contacts.find(({ id }) => id === contactId);
  return findedContact;
};

const removeContact = async (contactId) => {
  const contact = await getContactById(contactId);
  if (!contact) return;
  const contacts = await listContacts();
  const filteredContacts = contacts.filter(({ id }) => id !== contactId);
  await fs.writeFile(fileName, JSON.stringify(filteredContacts));
  return contact;
};

const addContact = async (body) => {
  await schema.and("name", "email", "phone").validateAsync(body);
  const newContact = { ...body, id: uuid.v1() };
  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(fileName, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  await schema.or("name", "email", "phone").validateAsync(body);
  const contact = await getContactById(contactId);
  if (!contact) return;
  const changedContact = { ...contact, ...body };
  const contacts = await listContacts();
  const newContacts = contacts.map((item) => {
    if (item.id === contactId) {
      return changedContact;
    } else {
      return item;
    }
  });
  await fs.writeFile(fileName, JSON.stringify(newContacts));
  return changedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
