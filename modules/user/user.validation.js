const Joi = require("joi");

// .options({ allowUnknown: true }) to accept the other keys
const displayProfile = {
    headers: Joi.object().required().keys({
        authorization: Joi.string().required()
    }).options({ allowUnknown: true })
}

const updatePassword = {
    body: Joi.object().required().keys({
        oldPassword: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)),
        newPassword: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/))
    })
}


module.exports = {
    displayProfile,
    updatePassword
}