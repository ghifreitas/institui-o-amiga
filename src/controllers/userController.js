const UserSchema = require('../models/userModel')
const bcrypt = require("bcrypt");

const criarUsuario = async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword

  if( !req.body.cnpj && !req.body.cpf ) {
    return res.status(400).send({
      message: "Você deve fornecer um cnpj ou cpf",
    })
  }

  if( req.body.cnpj && req.body.cpf ) {
    return res.status(400).send({
      message: "Você deve ser uma pessoa física (cpf) ou jurídica (cnpj), mas não ambos",
    })
  }

  if(req.body.cnpj) {
    const cnpjExists = await UserSchema.findOne({ cnpj: req.body.cnpj })

    if (cnpjExists) {
      return res.status(409).send({
        message: 'Cnpj já cadastrado',
      })
    }
  }
  else if(req.body.cpf) {
    const cpfExists = await UserSchema.findOne({ cpf: req.body.cpf })

    if (cpfExists) {
      return res.status(409).send({
        message: 'CPF já cadastrado',
      })
    }
  }
  
  try {
    const newUser = new UserSchema(req.body)

    const savedUser = await newUser.save()

    res.status(201).send({
      message: 'Usuário criado com sucesso',
      savedUser,
    })
  } catch (err) {
    console.error(err)
    res.status(400).send({
      message: err.message,
    })
  }
}

module.exports = {
  criarUsuario
}