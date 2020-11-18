const express = require('express');
const fs = require('fs');
const path = require('path');

// Requiring users file 
const product = require("../data/product");

const getProductByID = (id) =>{
    let productByID = null;
    for (let i = 0; i < product.length; i++) {
        if (product[i].id === id)
        productByID = product[i];
    }
    return productByID;
}

const deleteProductByID = (id) =>{
    let new_product = [];
    for (let i = 0; i < product.length; i++) {
        if (product[i].id !== id)
        new_product.push(product[i]);
    }
    return new_product;
}

const editProductByID = (new_product) =>{
    let updateProducts = product;
    for (let i = 0; i < updateProducts.length; i++) {
        if (updateProducts[i].id === new_product.id)
        updateProducts[i] = new_product;
    }
    return updateProducts;
}
const getMaxProductID = () => {
    let count = 0;
    for (let i = 0; i < product.length; i++) {
        if (product[i].id > count)
            count = product[i].id;
    }
    return count;
}

const checkDuplicateRecord = (name) => {
    let result = false;
    for (let i = 0; i < product.length; i++) {
        if (product[i].name === name) {
            result = true;
            break;
        }
    }
    return result;
}

// returns all the products present in the products.json file
const getProducts = async (req, res) => {
    res.status(200).send({
        data: product
    })
}

// add a new product in the in the products.json file
const addProducts = async (req, res) => {
    if (req.body.name === null || req.body.name === undefined || req.body.name === '')
        return res.status(400).send({ error: "name can not be empty" });
    if (req.body.brand === null || req.body.brand === undefined || req.body.brand === '')
        return res.status(400).send({ error: "brand can not be empty" });

    if (checkDuplicateRecord(req.body.name)) {
        return res.status(400).send({ error: "Record with given name already exists" }); 
    }
    const new_product = {
        "id": getMaxProductID() + 1,
        "name": req.body.name,
        "brand": req.body.brand,
        "count": req.body.count || 1,
        "desc": (req.body.desc === undefined || req.body.desc === null ? '' : req.body.desc)
    };

    product.push(new_product);

    let addProductResult = await fs.writeFileSync(path.join(__dirname, './../data/product.json'), JSON.stringify(product, null, 4))

    if (addProductResult instanceof Error) {
        res.status(503).send({
            "error": "Failed To Add a New Product"
        })
    }
    res.status(200).send({
        success: true,
        data: new_product
    })
}

// used to edit a given product by id
const editProducts = async (req, res) => {
    if(!getProductByID(parseInt(req.params.id))){
        return res.status(400).send({
            error: "Product With Given Id Doesnot exits"
        })
    }
    const currentProduct=getProductByID(parseInt(req.params.id));
    const new_product = {
        "id": currentProduct.id,
        "name": currentProduct.name,
        "brand": currentProduct.brand,
        "count": req.body.count || currentProduct.count,
        "desc": req.body.desc || currentProduct.desc
    };

    const updatedProducts = editProductByID(new_product)

    let updateProductResult = await fs.writeFileSync(path.join(__dirname, './../data/product.json'), JSON.stringify(updatedProducts, null, 4))

    if (updateProductResult instanceof Error) {
        res.status(503).send({
            "error": "Failed To Edit the Product"
        })
    }
    res.status(200).send({
        success: true,
        data: new_product
    })
}

// used to delete a given product by id
const deleteProducts = async (req, res) => {
    if(!getProductByID(parseInt(req.params.id))){
        return res.status(400).send({
            error: "Product With Given Id Doesnot exits"
        })
    }
    let updatedProducts =deleteProductByID(parseInt(req.params.id));
    let deleteProductResult = await fs.writeFileSync(path.join(__dirname, './../data/product.json'), JSON.stringify(updatedProducts, null, 4))

    if (deleteProductResult instanceof Error) {
        res.status(503).send({
            "error": "Failed To Delete the Product"
        })
    }
    res.status(200).send({
        success: true,
        data: parseInt(req.params.id)
    })

}

const router = express.Router();
router.route('/')
    .get(getProducts)
    .post(addProducts)
router.route('/:id')
    .put(editProducts)
    .delete(deleteProducts)    

module.exports = router