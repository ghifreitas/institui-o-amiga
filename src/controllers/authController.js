const UserSchema = require('../models/userModel'); // importei o model
const bcrypt = require('bcrypt'); // importei o bcrypt para criptografar a senha
const jwt = require('jsonwebtoken'); // importei o jwt para gerar o token

const SECRET = process.env.SECRET; // importei a secret para ser usada pelo JWT na geracao do token

const login = (req, res) => {
    try {
        
        UserSchema.findOne({ email: req.body.email }, (error, user) => {
            console.log("USUARIO EH ESSE AKI", user)
            if(!user) {
                return res.status(404).send({
                    message: 'Usuário não encontrado',
                    email: `${req.body.email}`
                });
            }
            
            // quando eu chego aqui eu tenho um usuario que foi enviado no body da requisicao e um usuario no banco com o MESMO email
            // eu preciso saber se as senhas deles tambem sao iguais
            const validPassword = bcrypt.compareSync(req.body.password, user.password)
            
            if(!validPassword){
                return res.status(401).send({
                message: "Senha inválida",
                statusCode: 401
                })
            }
            
            // jwt.sign(nome do usuário, SEGREDO)
            const token = jwt.sign({nome: user.name, tipo: user.tipo, email: user.email}, SECRET);
            
            res.status(200).send({
                message: "Login efetuado com sucesso",
                token
            });
        })
    } catch(err) {
        console.error(err)
    }
};

const getUserEmail = (req, res) => {
    
    const authHeader = req.get('authorization');
    if (!authHeader) {
        return res.status(401).send({
            message: 'Você não possui autorização para realizar esta ação',
            statusCode: 401
        });
    }
    
    const token = authHeader.split(' ')[1];
    // console.log("tokenzinhooo", token)
    
    if (!token) {
        return res.status(401).send({
            message: "Token inválido"
        })
    }
    
    try {
        const mensagem = jwt.decode(token);
        return mensagem.email;
    } catch(err) {
        console.error(err)
    }
}

module.exports = {
    login,
    getUserEmail
};