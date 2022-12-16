const app = require("../app");
const bcrypt = require("bcrypt");
const request = require("supertest");
const userModel = require("../models/userModel");
const projetoModel = require("../models/projetoModel");

const jwt = require('jsonwebtoken'); // importei o jwt para gerar o token
const SECRET = process.env.SECRET; // importei a secret para ser usada pelo JWT na geracao do token

let token = null;

const user = new userModel({
    nome: "TESTE" + new Date().getTime(),
    cpf: "11122233344",
    password: bcrypt.hashSync("TESTE", 10),
});

console.log(user.email);

describe("Produtos Controller", () => {

    // teste para checar se o sistema retorna 403 numa rota que o cliente não tem
    // autorização (só para gerentes)
    test("GET /comentario/listar", (done) => {
        request(app)
            .get("/comentario/listar")
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect((res) => {
                expect(res.body.length >= 0).toBe(true);
            })
            .end((err) => {
                if (err) return done(err);
                return done();
            });
    });

    test("POST /projeto/criar", (done) => {
        token = jwt.sign({nome: user.name, id: user._id}, SECRET);
            
        request(app)
            .post("/projeto/criar")
            .set('Authorization', 'Bearer ' + token)
            .send({
                "nome": "Projeto Sangue bão",
                "finalidade": "Aumentar a arrecadação de sangue",
                "descricao": "Conscientização e ações práticas para aumentar a doação de sangue"
            })
            .expect(201)
            .end(async (err, res) => {
                console.log(res.body)
                // await projetoModel.deleteMany({responsavel: user.id});

                if (err) return done(err);
                return done();
            });
    });

    test("POST /projeto/criar sem estar logado", (done) => {

        request(app)
            .post("/projeto/criar")
            .send({
                "nome": "Projeto Sangue bão",
                "finalidade": "Aumentar a arrecadação de sangue",
                "descricao": "Conscientização e ações práticas para aumentar a doação de sangue"
            })
            .expect(401)
            .end(async (err) => {

                if (err) return done(err);
                return done();
            });
    });
    

//     test("POST /bibliotecas/criar", (done) => {

//         const bibliotecaBody ={
//             nome: "Biblioteca2 Teste",
//             cnpj: 221222000133,        
//             iniciativa_privada:true,
//             endereco:{
//                 cep: '21222-333',
//                 rua: 'rua XYZA',
//                 numero: '9999',
//                 estado: 'SC',
//                 cidade: 'cidadeX',
//                 bairro: 'bairroX'
//                 },
//             bairros_atuantes:['bairro1', 'bairro2', 'bairro3'],
//             atividades_disponiveis: ['leitura', 'aluguel', 'poesia'],
//             site: "http://bibliotecateste.com.br",
//             responsavel:'Responsavel Teste'
//         };

//         request(app)
//             .post("/bibliotecas/criar")
//             .send(bibliotecaBody)
//             .expect(201)
//             .expect((res) => {
//                 expect(res.body.biblioteca.nome).toBe("Biblioteca2 Teste");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 return done();
//             });
//     });

//     test("DELETE /bibliotecas/remover/:id", (done) => {

//         request(app)
//             .delete("/bibliotecas/remover/" + bibliotecaMock.id)
//             // .send({id: ""})
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.message).toBe("Biblioteca removida com sucesso");
//             })
//             .end((err) => {
//                 if (err) return done(err);
//                 return done();
//             });
//     });

//     test("DELETE /bibliotecas/remover/:id 404", (done) => {

//         request(app)
//             .delete("/bibliotecas/remover/2222")
//             // .send({id: ""})
//             .expect(404)
//             .end((err) => {
//                 if (err) return done(err);
//                 return done();
//             });
//     });

});