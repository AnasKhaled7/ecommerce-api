const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_title: {
        type: String
    },
    product_desc: {
        type: String
    },
    product_price: {
        type: Number
    },
    image: { type: Array },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isHidden: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    whishlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    qrcode: { type: String }
}, {
    timestamps: true
});

productSchema.pre('findOneAndUpdate', async function (next) {
    const hookData = await this.model.findOne(this.getQuery()).select('__v');
    this.set({ __v: hookData.__v + 1 })
    next();
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;