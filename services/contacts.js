const Contact = require('../schemas/contact');

const getAllContacts = async (owner, { favourite, skip, limit }) => {
	const query = { owner }
	if(favourite !== undefined ){
		query.favourite = favourite
	}
	return Contact.find(query).skip(skip).limit(limit);
};

const getContactById = (owner, id) => {
	return Contact.findOne({ _id: id, owner });
};

const createContact = (owner, { name, email, phone, favorite }) => {
	return Contact.create({ name, email, phone, favorite, owner});
};

const updateContact = (owner, id, fields) => {
	return Contact.findByIdAndUpdate({ _id: id, owner}, fields, { new: true });
};

const updateStatusContact = (owner, id, body) => {
	return Contact.findByIdAndUpdate({ _id: id, owner }, body);
};

const removeContact = (owner, id) => {
	return Contact.findByIdAndRemove({ _id: id, owner});
};

module.exports = {
	getAllContacts,
	getContactById,
	createContact,
	updateContact,
	removeContact,
	updateStatusContact
};