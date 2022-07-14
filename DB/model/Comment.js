const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment_body: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, {
    timestamps: true
});

commentSchema.pre('findOneAndUpdate', async function (next) {
    const hookData = await this.model.findOne(this.getQuery()).select('__v');
    this.set({ __v: hookData.__v + 1 })
    next();
});

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;