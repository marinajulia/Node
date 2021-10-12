'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customerRepository');

exports.post = async (req, res, next) => {
    var contract = new ValidationContract();
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        await repository.create(req.body)
        res.status(201).send({ message: 'Produto cadastrado com sucesso' });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        })
    }
}
