const productModel = require("../../../DB/model/Product");

const getAllProducts = async (req, res) => {
    const products = await productModel.find({}).populate([
        {
            path: 'createdBy',
            select: 'firstName lastName email'
        },
        {
            path: 'comments',
            select: 'comment_body createdBy reply',
            populate: [
                {
                    path: 'createdBy',
                    select: 'firstName lastName email'
                },
                {
                    path: 'reply',
                    select: 'comment_body createdBy',
                    populate: [
                        {
                            path: 'createdBy',
                            select: 'firstName lastName email'
                        },
                    ]
                }
            ]
        },
        {
            path: 'likes',
            select: 'firstName lastName email',
        }
    ]);
    res.status(200).json({ products });
}

const addProduct = async (req, res) => {
    try {
        const { product_title, product_desc, product_price } = req.body;
        if (req.fileErr) {
            res.status(400).json({ message: 'in-valid format' });
        } else {
            const imageURL = [];
            req.files.forEach(file => {
                imageURL.push(`${req.finalDestination}/${file.filename}`)
            });
            const newProduct = new productModel({ product_title, product_desc, product_price, image: imageURL, createdBy: req.user._id });
            const savedProduct = await newProduct.save();
            res.status(201).json({ message: 'success', savedProduct });
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

// to like if the user id is not found in the array of likes or unlike when the user's id is found in the array
const likeAndUnlileProduct = async (req, res) => {
    try {
        const product = await productModel.findOne({ _id: req.params.id });
        if (!product) {
            res.status(404).json({ message: 'in-valid post id' });
        } else {
            if (!product.likes.includes(req.user._id)) {
                await productModel.findByIdAndUpdate(req.params.id, { $push: { likes: req.user._id } });
                res.status(200).json({ message: "like" });
            } else {
                await productModel.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } });
                res.status(200).json({ message: "unlike" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    likeAndUnlileProduct
}