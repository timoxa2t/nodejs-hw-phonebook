const User = require('../schemas/user');

const register = ({email, password}) => {
  return User.create({email, password});
};

const getById = (_id) => {
    return User.findById({ _id });
}

const login = ({email}) => {
    return User.findOne({ email });
};
  
const checkEmail = (email) => {
    return User.findOne({ email });
};

const updateToken = ({_id, token}) => {
    return User.findByIdAndUpdate({ _id }, { token });
}

const removeToken = id => {
    return User.findByIdAndUpdate({ _id: id }, { $unset: { token: 1 } });
};

const getByToken = (token) => {
    return User.findOne({ token });
}

const changeSubscription = ({ _id, subscription}) => {
    return User.findByIdAndUpdate({ _id }, { subscription });
}

module.exports = {
    register,
    login,
    checkEmail,
    updateToken,
    removeToken,
    getByToken,
    getById,
    changeSubscription
};