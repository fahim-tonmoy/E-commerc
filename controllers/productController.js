const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const { Product, validate } = require('../models/product');
const { result } = require('lodash');

module.exports.createProduct = async (req, res) => {
   let form = new formidable.IncomingForm();
   form.keepExtensions = true;
   form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).send("Something went Wrong!!");
    const { error } = validate(_.pick(fields, ["name","description","price","category","quantity"]));
    if (error) return res.status(400).send(error.details[0].message);
 
   const product = new Product(fields);
   if (files.photo) {
    //    <input type="file" name="photo" />
    fs.readFile(files.photo.path, (err, data) => {
       if (err) res.status(400).send("Problem in file data!!");
       product.photo.data = data;
       product.photo.contentType = files.photo.type;
       product.save((err, result)=> {
           if (err)  res.status(500).send("Internal Server error!!");
           else return res.status(201).send({
               message: "Product created successfully!",
               data: _.pick(result, ["name","description","price","category","quantity"])
           });
       });
    })
   } else res.status(400).send("No image provided!!");
})
}

module.exports.getProducts =async (req, res) => {
    let order = req.query.order === 'desc' ? -1 : 1;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const products = await Product.find()
    .select({ photo: 0 })
    .sort({ [sortBy]: order})
    .limit(limit)
    .populate('category', 'name');
    return res.status(200).send(products);
}

module.exports.getProductById = async(req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
    .select({ photo: 0 })
    .populate('category', 'name');
    if (!product) res.status(404).send('not found!');
    return res.status(200).send(product);
}

module.exports.getPhoto = async(req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
    .select({ photo: 1, _id: 0})
    res.set('content-Type', product.photo.contentType);
    return res.status(200).send(product.photo.data);
}

module.exports.updateProductById = async(req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
   form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).send("Something Wrong!!");
    const updatedFields = _.pick(fields, ["name","description","price","category","quantity"]);
    _.assignIn(product, updatedFields);

    if (files.photo) {
        fs.readFile(files.photo.path, (err, data) => {
            if (err) return res.status(400).send("Something Wrong!!");
            product.photo.data = data;
            product.photo.contentType = files.photo.type;
            product.save((err, result) => {
                if (err) return res.status(500).send("Something Wrong!!");
                // console.log("Something Wrong!!")
                else return res.status(200).send({
                    message: "product updated successfully!",
                })
            })
        })
    } else {
        product.save((err, result) => {
            if (err) return res.status(500).send("Something Wrong!!");
            else return res.status(200).send({
                message: "product updated successfully!",
            })
        })
    }
   })
}

// demo body
// const body = {
//     order: "desc",
//     sortBy: "price",
//     limit: 6,
//     skip: 20,
//     filters: {
//         price: [1000, 3000],
//         category: ['nsddaskjnsan', 'ashjcvashvcb', 'ashahsbcasjbnc']
//     }
// }

// filter by any fields
module.exports.filterProducts = async (req, res) => {
   
    let order = req.body.order === 'desc' ? -1 : 1;
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = parseInt(req.body.skip);

    let filters = request.body.filters;
    let args = {};

    for ( let key in filters ) {
        if ( filters[key].length > 0 ) {
            if ( key === 'price' ) {
                args['price'] = {
                        $gte: parseInt(filters['price'][0]),
                        $lte: parseInt(filters['price'][1])
                    }
                    console.log(args);
                }
            if ( key === 'category' ) {
                    args['category'] = {
                        $in: filters['category']
                        }
                        console.log(args);
            }
        }
    }

    try {
        const products = await Product.find(args)
        .select({ photo: 0 })
        .populate('category', 'name')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);
        return res.status(200).send(products);
      } catch (error) {
        console.error(error);
      }
}







// const body = {
//     order: 'desc',
//     sortBy: 'price',
//     limit: 6,
//     skip: 20,
//     filters: {
//         price: [1000, 2000],
//         category: ['604cc12312312', '60743dfgfdgfd', '60743dfdsfdd']
//     }
// }
// module.exports.filterProducts = async (req, res) => {
//     let order = req.body.order === 'desc' ? -1 : 1;
//     let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
//     let limit = req.body.limit ? parseInt(req.body.limit) : 10;
//     let skip = parseInt(req.body.skip);
//     let filters = req.body.filters;
//     let args = {}

//     for (let key in filters) {
//         if (filters[key].length > 0) {
//             if (key === 'price') {
//                 // { price: {$gte: 0, $lte: 1000 }}
//                 args['price'] = {
//                     $gte: filters['price'][0],
//                     $lte: filters['price'][1]
//                 }
//                 console.log("args:", args);
//             }
//             if (key === 'category') {
//                 // category: { $in: [''] }
//                 args['category'] = {
//                     $in: filters['category']
//                 }
//                 console.log("args:", args);
//             }
//         }
//     }


//     const products = await Product.find()
//         .select({ photo: 0 })
//         .populate('category', 'name')
//         .sort({ [sortBy]: order })
//         .skip(skip)
//         .limit(limit)
//     return res.status(200).send(products);
// }