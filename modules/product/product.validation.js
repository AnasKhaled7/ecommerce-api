const Joi = require("joi");

const addProduct = {
    body: Joi.object().required().keys({
        product_title: Joi.string(),
        product_desc: Joi.string(),
        product_price: Joi.number(),
    })
}

const createComment = {
    body: Joi.object().required().keys({
        comment_body: Joi.string().required(),

    }),
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

const likeProduct = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

const replyOnComment = {
    body: Joi.object().required().keys({
        comment_body: Joi.string().required(),
    }),
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required(),
        commentID: Joi.string().min(24).max(24).required()
    })
}

module.exports = {
    addProduct,
    createComment,
    likeProduct,
    replyOnComment
}