'use strict';
const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { title: 'Products', products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET form to add a new product
router.get('/addProduct', (req, res) => {
    // Check if the user is logged in
    if (!logged) {
        return res.redirect('../auth'); // Redirect to login if not logged in
    }
    else {
        res.render('addProduct', { title: 'Add Product' });
    }
});

// POST to add a new product
router.post('/addProduct', async (req, res) => {
    try {
        const { name, description, quantity, price } = req.body;
        const username = res.locals.username;
        const newProduct = new Product({
            name,
            description,
            quantity,
            price: parseFloat(price),
            username
        });
        await newProduct.save();
        res.redirect('/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET your products if logged in
router.get('/myProducts', async (req, res) => {
    try {
        const logged = res.locals.logged;
        const username = res.locals.username;
        console.log(logged);
        // Check if the user is logged in
        if (!logged) {
            return res.redirect('../auth'); // Redirect to login if not logged in
        }
        console.log('Your Products');

        // Filter products by username
        const products = await Product.find({ username: username });

        res.render('myProducts', { title: 'My Products', products });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET form to edit a product
router.get('/myProducts/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(productId);
        const product = await Product.findById(productId);
        res.render('editProduct', { title: 'Edit Product', product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT to edit a product
router.post('/myProducts/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;;
        const { name, description, quantity, price } = req.body;
        await Product.findByIdAndUpdate(productId, { name, description, quantity, price: parseFloat(price) });
        res.redirect('/products/myProducts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE a product
router.get('/myProducts/delete/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findOneAndDelete({ _id: productId });
        res.redirect('/products/myProducts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
