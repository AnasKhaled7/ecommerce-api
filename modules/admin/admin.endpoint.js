const { roles } = require("../../middleware/auth");

const endpoint = {
    getAllUsers: [roles.Admin]
}

module.exports = {
    endpoint
}