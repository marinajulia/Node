'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customerRepository');
const md5 = require("md5");

const emailService = require('../services/emailService');

exports.post = async (req, res, next) => {
    var contract = new ValidationContract();
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        emailService.send
            (req.body.email,
                'Bem vindo ao node Store',
                global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(201).send({ message: 'Produto cadastrado com sucesso' });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        })
    }
}
