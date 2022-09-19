const service = require('./service')

const get = async (req, res, next) => {
    try {
      const results = await service.getAllContacts();
      res.json(results);
    } catch (e) {
      console.error(e);
      next(e);
    }
};

const getById = async (req, res, next) => {
    const { contactId } = req.params;
    try {
      const result = await service.getContactById(contactId);
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({
          message: `Not found contact id: ${contactId}`,
        });
      }
    } catch (e) {
      console.error(e);
      next(e);
    }
};

const addContact = async (req, res, next) => {
  
    if(!Object.prototype.hasOwnProperty.call(req.body, 'favorite')){
        req.body.favorite = false
    }
    try{
    const result = await service.createContact(req.body)
    if (result) {
        res.status(201).json(result);
      } else {
        res.status(400).json({
          message: `Cant create contact: ${req.body}`,
        });
      }
    } catch (e) {
      console.error(e);
      next(e);
    }
}

const removeContact = async (req, res, next) => {
    const { contactId } = req.params;
    try{
    const result = await service.removeContact(contactId)
    if (result) {
        res.json(result);
      } else {
        res.status(404).json({
          message: `Not found contact id: ${contactId}`,
        });
      }
    } catch (e) {
      console.error(e);
      next(e);
    }
}

const updateContact = async (req, res, next) => {

    const { contactId } = req.params;
    try{
    const result = await service.updateContact(contactId, req.body)
    if (result) {
        res.json(result);
      } else {
        res.status(404).json({
          message: `Not found contact id: ${contactId}`,
        });
      }
    } catch (e) {
      console.error(e);
      next(e);
    }
}

const updateFavorite = async (req, res, next) => {

    const { contactId } = req.params;

    try{
        if(Object.prototype.hasOwnProperty.call(req.body, 'favorite')){
            const result = await service.updateStatusContact(contactId, req.body)
            if (result) {
                res.json(result);
              } else {
                res.status(404).json({
                  message: `Not found`,
                });
              }
        }
        else{
            res.status(400).json({
                message: "missing field favorite",
            });
        }
    } catch (e) {
      console.error(e);
      next(e);
    }
}

module.exports = {
    get,
    getById,
    addContact,
    removeContact,
    updateContact,
    updateFavorite
}