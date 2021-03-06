'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/productRepository');
const azure = require('azure-storage');
const config = require('../config');
const guid = require('guid');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }
}

exports.getBySlug = async (req, res, next) => {
    try {
        var data = await repository.getbySlug(req.params.slug)
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getbyId(req.params.id)
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }
}

exports.getByTag = async (req, res, next) => {
    try {
        var data = await repository.getbyTag(req.params.tag)
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }
}

exports.post = async (req, res, next) => {
    var contract = new ValidationContract();
    // contract.hasMinLen(req.body.description, 3, 'O título deve conter pelo menos 3 caracteres');
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try{
        //cria blob service:
        const blobSvc = azure.createBlobService(config.containerConnectionString);

        let filename = guid.raw().toString() + '.jpg';
        let rawData = req.body.image;
        let matches = rawData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer= new Buffer(matches[2], 'base64');

        //salva imagem:
        await blobSvc.createBlockBlobFromText('product-images', filename, buffer,{
            contentType: type
        }, function(error, result, response){
            if(error){
                filename = 'default-product.png'
            }
        });

        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: 'https://nodestrbalta.blob.core.windows.net/product-images/' + filename
        })
        res.status(201).send({ message: 'Produto cadastrado com sucesso' });

    }catch (e) {
        console.log(e)
        res.status(500).send({
            message: 'Falha ao processar requisição'
        })
    }
}

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({ message: 'Produto atualizado com sucesso' });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        })
    }
}
exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id)
        res.status(200).send({ message: 'Produto removido com sucesso' });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        })
    }
}
