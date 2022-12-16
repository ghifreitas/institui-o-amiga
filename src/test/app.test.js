const app = require("../app");
const bcrypt = require("bcrypt");
const request = require("supertest");
const userModel = require("../models/userModel");
const reservaModel = require("../models/reservaModel");

const jwt = require('jsonwebtoken'); // importei o jwt para gerar o token
const SECRET = process.env.SECRET; // importei a secret para ser usada pelo JWT na geracao do token

const email = "TESTE" + new Date().getTime();
let token = null;

const user = new userModel({
    name: "TESTE",
    email: email,
    password: bcrypt.hashSync("TESTE", 10),
    tipo: "CLIENTE"
});

console.log(user.email);

describe("Produtos Controller", () => {

    beforeAll(async()=>{

        const usuario = await  userModel.findOne({email});

        if( !usuario ) {
            console.log("NENHUM USUÁRIO ENCONTRADO - NULL");
            await user.save();
            token = jwt.sign({nome: user.name, tipo: user.tipo, email: user.email}, SECRET);
            console.log("TOKEN: " + token);
        }
    });

    // teste para checar se o sistema retorna 403 numa rota que o cliente não tem
    // autorização (só para gerentes)
    test("GET /reserva/listar", (done) => {
        request(app)
            .get("/reserva/listar")
            .set('Authorization', 'Bearer ' + token)
            .expect(403)
            .expect((res) => {
                expect(res.body.mensagem).toBe("VOCE NÃO TEM ACESSO A ESSAS INFORMAÇÕES");
            })
            .end((err) => {
                if (err) return done(err);
                return done();
            });
    });

    test("POST /reserva/criar", (done) => {
        request(app)
            .post("/reserva/criar")
            .set('Authorization', 'Bearer ' + token)
            .send({
                "horarioInicio": "2022-12-22T11:00:00Z",
                "horarioFim": "2022-12-22T13:30:00Z",
                "quantidadeDePessoas": 5
            })
            .expect(201)
            .end(async (err) => {
                await reservaModel.deleteMany({responsavel: email});

                if (err) return done(err);
                return done();
            });
    });

    test("GET /reserva/listar_reserva_do_cliente", (done) => {
        request(app)
            .get("/reserva/listar_reserva_cliente")
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect((res) => {
                console.log("RESULT: ", res.body);
                expect(res.body.length).toBe(0);
            })
            .end((err) => {
                if (err) return done(err);
                return done();
            });
    });

    test("POST /reserva/criar com intervalo errado", (done) => {
        request(app)
            .post("/reserva/criar")
            .set('Authorization', 'Bearer ' + token)
            .send({
                "horarioInicio": "2022-12-23T14:00:00Z",
                "horarioFim": "2022-12-23T13:30:00Z",
                "quantidadeDePessoas": 5
            })
            .expect(400)
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