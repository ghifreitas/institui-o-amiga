const mongoose = require('mongoose');

const MesaSchema = require("../models/mesaModel");
const ReservaSchema = require("../models/reservaModel");

const criarMesa = async(req, res) => {
    const {numero, capacidade } = req.body;
    try{
        const testeMesa = await MesaSchema.find({numero});
        if(testeMesa && testeMesa.length) {
            return res.status(409).json({
                mensagem: "Mesa já existente"
            });
        }

        if(numero <= 0) {
            return res.status(400).json({
                mensagem: "Número de mesa inválido"
            });
        }

        if(capacidade <= 0) {
            return res.status(400).json({
                mensagem: "Capacidade inválida"
            });
        }

        const mesa = new MesaSchema({
            numero,
            capacidade
        })
        const mesaSalva = await mesa.save();
        res.status(201).json({
            mesa: mesaSalva
        })

    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
}

const listarMesas = async(req, response) => {
    //const {nome} = req.query;

    let query = { };

    //if (nome) query.nome = new RegExp(nome, 'i');

    try {
        const mesas = await MesaSchema.find(query);
        response.status(200).json(mesas);

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
}

const buscarBibliotecasPorID = async(req, res) => {
    const { id } = req.params;

    try {
        const bibliotecas = await MesaSchema.find(req.params)

        const bibliotecaEncontrada = bibliotecas.find(bibliotecaAtual => {
            return bibliotecaAtual.id == id
        });

        res.status(200).send(bibliotecaEncontrada);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const atualizarMesa = async(req, response) => {
    const { numero, capacidade } = req.params;

    try {
        const mesa = MesaSchema.findOne({numero});
        if( !mesa ){
            return res.status(404).send({mensagem: "mesa inexistent"});    
        }

        const reservas = await ReservaSchema.findOne({
            status: "ATIVA",
            numeroDaMesa: numero,
            horarioFim: {$gt: new Date()}
        })

        if( reservas) {
            return res.status(403).send({mensagem: "Esta mesa tem reservas associadas"});    
        }
        
        const reserva = await MesaSchema.findByIdAndUpdate(id, body, {returnDocument:'after'});
        
        response.status(200).send(reserva)
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

}

const removerMesa = async(req, res) => {
    const { numero } = req.params;

    try {
        const mesa = await MesaSchema.findOne({numero});
        if( !mesa  ){
            return res.status(404).send({mensagem: "mesa inexistente"});    
        }

        const reservas = await ReservaSchema.findOne({
            status: "ATIVA",
            numeroDaMesa: numero,
            horarioFim: {$gt: new Date()}
        })

        if( reservas) {
            return res.status(403).send({mensagem: "Esta mesa tem reservas associadas"});    
        }
        
        await MesaSchema.findOneAndDelete({numero});

        return res.status(204).send();
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        });
    }

}

module.exports = {
    criarMesa,
    listarMesas,
    buscarBibliotecasPorID,
    atualizarMesa,
    removerMesa
}
