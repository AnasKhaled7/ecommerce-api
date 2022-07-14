const { roles } = require("../../middleware/auth");


const endpoint = {
    addProduct: [roles.Admin, roles.User]
}

module.exports = endpoint;