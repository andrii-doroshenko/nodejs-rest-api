const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const writeFile = async (data) => {
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
};

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  return result || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const updatedContacts = contacts.filter(
    (contact) => contactId !== contact.id
  );

  if (contacts.length === updatedContacts.length) {
    return null;
  }

  await writeFile(updatedContacts);

  const removedContact = contacts.find((contact) => contact.id === contactId);
  return !removedContact ? null : removedContact;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);

  await writeFile(contacts);
  return newContact;
};

const updateContact = async (id, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  contacts[index] = { id, ...body };
  await writeFile(contacts);
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
