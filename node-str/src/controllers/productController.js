'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.post = ('/', (req, res, next) =>{
    var product = new Product(req.body);
    //para instanciar um por vez (em vez de tudo de uma vez como o de cima):
    // product.title = req.body.title;
    product
        .save()
        .then(x=>{
            res.status(201).send({message: 'Produto cadastrado com sucesso'});
        }).catch(e=>{
            res.status(400).send({message: 'Falha ao cadastrar o produto',
            data: e});
        });
});

exports.put = ('/:id', (req, res, next) =>{
    const id = req.params.id;
    res.status(201).send({
        id: id, item: req.body
    });
});

exports.delete = ('/', (req, res, next) =>{
    res.status(200).send(req.body);
});