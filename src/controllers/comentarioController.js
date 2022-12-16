const mongoose = require('mongoose');

const ProjetoSchema = require("../models/projetoModel");
const ComentarioSchema = require("../models/comentarioModel");
const { obterIdUsuario } = require('./authController');

const criarComentario = async(req, res) => {
    const {projeto, sugestao } = req.body;
    try{
        const projetoBuscado = await ProjetoSchema.findById(projeto);
        if(!projetoBuscado) {
            return res.status(404).json({
                mensagem: "Projeto inexistente"
            });
        }

        const id = obterIdUsuario(req, res);
        
        const comentario = new ComentarioSchema({
            projeto,
            sugestao,
            autor: id
        })
        const comentarioSalvo = await comentario.save();
        res.status(201).json({
            comentarioSalvo
        })

    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
}

const listarComentarios = async(req, response) => {
    const {projeto} = req.query;

    let query = { };

    if( projeto ){
        query["projeto"] = projeto;
    }

    try {
        const comentarios = await ComentarioSchema.find(query);
        response.status(200).json(comentarios);

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
}

const buscarprojetoPorID = async(req, res) => {
    const { id } = req.params;

    try {
        const bibliotecas = await ProjetoSchema.find(req.params)

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

const atualizarComentario = async(req, res) => {
    const { id } = req.params;
    const { sugestao } = req.body;

    try {
        const idAutor = obterIdUsuario(req, res);
        const comentario = await ComentarioSchema.findOne({_id: id, autor: idAutor});
        if( !comentario ){
            return res.status(404).send({mensagem: "comentário inexistente"});    
        }

        const comentarioAtualizado = await ComentarioSchema.findByIdAndUpdate(id, {sugestao}, {returnDocument:'after'});    

        res.status(200).send({comentarioAtualizado})
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

}

const removerComentario = async(req, res) => {
    const { id } = req.params;

    try {
        const idAutor = obterIdUsuario(req, res);
        const comentario = await ComentarioSchema.findOne({_id: id, autor: idAutor});
        if( !comentario ){
            return res.status(404).send({mensagem: "comentário inexistente"});    
        }
        
        await ComentarioSchema.findByIdAndDelete(id);

        return res.status(204).send();
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        });
    }

}

module.exports = {
    criarComentario,
    listarComentarios,
    atualizarComentario,
    removerComentario
}
