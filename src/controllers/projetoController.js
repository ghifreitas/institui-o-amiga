const mongoose = require('mongoose');
const {obterIdUsuario, obterNomeUsuario} = require('./authController'); 

const ComentarioSchema = require("../models/comentarioModel");
const ProjetoSchema = require("../models/projetoModel");


async function checarMesaDisponivel(horarioInicio, horarioFim, quantidade) {
    const mesas = await checarMesas(quantidade);
    if( !mesas.length ) return null;
    
    const mesasOcupadas = await checarMesaDisponivelIntervalo(horarioInicio, horarioFim);

    for (const mesaocupada of mesasOcupadas) {
        const indice = mesas.indexOf(mesaocupada);
        if( indice !== -1 ) {
            mesas.splice(indice, 1);
        }
    }

    if( !mesas.length ) return null;

    return mesas[0];
}

async function checarMesaDisponivelIntervalo(horarioInicio, horarioFim) {
    const reservasCruzamInicio = await ComentarioSchema.find({
        horarioInicio: {$lte: horarioInicio},
        horarioFim: {$gt: horarioInicio},
    }); 

    const reservasCruzamFim = await ComentarioSchema.find({
        horarioInicio: {$lte: horarioFim},
        horarioFim: {$gt: horarioFim},
    }); 
    
    return [...reservasCruzamInicio.map(r => r.numeroDaMesa), ...reservasCruzamFim.map(r => r.numeroDaMesa)];
}

const criarProjeto = async(req, res) => {

    try{
        const dadosProjeto = req.body;
        const responsavel = obterIdUsuario(req, res); // TODO: check e-mail
        dadosProjeto["responsavel"] = responsavel;

        const projeto = new ProjetoSchema(dadosProjeto)
        const projetoSalvo = await projeto.save();
        res.status(201).json({
            projeto: projetoSalvo
        })

    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }

    
}

const listarProjetos = async(req, response) => {
    //const {nome} = req.query;

    let query = { };

    //if (nome) query.nome = new RegExp(nome, 'i');

    try {
        const projetos = await ProjetoSchema.find(query);
        response.status(200).json(projetos);

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
}

const atualizarProjeto = async(req, response) => {
    
    try {
        const { id } = req.params;
        const userId = obterIdUsuario(req, response);
        const projeto = await ProjetoSchema.findOne({_id: id, responsavel: userId})
        if( !projeto ) {
            response.status(404).json({
                message: "Não encontramos um projeto seu com estas características"
            });
        }
        const dadosProjeto = req.body;
        delete dadosProjeto.id;
        delete dadosProjeto.responsavel;

        const projetoAtualizado = await ProjetoSchema.findByIdAndUpdate(id, dadosProjeto, {returnDocument:'after'});    
        response.status(200).json({
            projetoAtualizado
        });
    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
}

const obterProjetoPorId = async(req, response) => {
    
    try {
        const { id } = req.params;
        const projeto = await ProjetoSchema.findById(id)
        if( !projeto ) {
            response.status(404).json({
                message: "Projeto não encontrado"
            });
        }

        response.status(200).json(projeto);
    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
}

const removerProjeto = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = obterIdUsuario(req, res);
        const projeto = await ProjetoSchema.findOne({_id:id, responsavel: userId})
        if( !projeto ) {
            return res.status(404).json({
                message: "Não encontramos um projeto seu com estas características",
                responsavel: userId
            });
        }


        await ProjetoSchema.findByIdAndDelete(id);
        //await ProjetoSchema.findById(id).remove();

        res.status(200).send({mensagem: "projeto removido", projeto});
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    criarProjeto,
    listarProjetos,
    obterProjetoPorId,
    atualizarProjeto,
    removerProjeto
}
