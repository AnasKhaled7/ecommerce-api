const commentModel = require("../../../DB/model/Comment");
const productModel = require("../../../DB/model/Product");

// to create comment on product
const createComment = async (req, res) => {
    try {
        const { comment_body } = req.body;
        const { id } = req.params;
        const { _id } = req.user;

        const product = await productModel.findOne({ _id: id });
        if (!product) {
            res.status(404).json({ message: "In-valid product id" });
        } else {
            const createComment = new commentModel({ comment_body, createdBy: _id, productId: product._id });
            const savedComment = await createComment.save();
            await productModel.findByIdAndUpdate(product._id, { $push: { comments: savedComment._id } });
            res.status(200).json({ message: "done" });
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

// reply
const replyOnComment = async (req, res) => {
    try {
        const { comment_body } = req.body;
        const { id, commentID } = req.params;
        const { _id } = req.user

        const product = await productModel.findOne({ _id: id })
        if (!product) {
            res.status(404).json({ message: "In-valid product id" })
        } else {
            const comment = await commentModel.findOne({ _id: commentID, productId: product._id })
            if (!comment) {
                res.status(404).json({ message: "In-valid comment id" })
            } else {
                const createComment = new commentModel({ comment_body, createdBy: _id, productId: product._id })
                const savedComment = await createComment.save()
                await commentModel.findByIdAndUpdate(commentID, { $push: { reply: savedComment._id } })
                res.status(200).json({ message: "Done" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}


module.exports = {
    createComment,
    replyOnComment
}