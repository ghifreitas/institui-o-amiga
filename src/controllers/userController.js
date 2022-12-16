const UserSchema = require('../models/userModel')
const bcrypt = require("bcrypt");

const getAll = async (req, res) => {
    UserSchema.find(function (err, users) {
      if (err) {
        res.status(500).send({ message: err.message })
      }
      users = users.filter(u => u.tipo === "CLIENTE").map( u => {
        delete u.password;
        
        return {
          "id": u._id,
          "name": u.name,
          "email": u.email,
          "createdAt": u.createdAt,
        };
      } );
      res.status(200).send(users);
    })
  }

async function createUser(req, res, tipo){
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword

  const emailExists = await UserSchema.exists({ email: req.body.email })

  if (emailExists) {
    return res.status(409).send({
      message: 'Email já cadastrado',
    })
  }

  try {
    const cliente = {...req.body, ...{"tipo": tipo} };
    const newUser = new UserSchema(cliente)

    const savedUser = await newUser.save()

    res.status(201).send({
      message: 'Usuário criado com sucesso',
      savedUser,
    })
  } catch (err) {
    console.error(err)
    res.status(500).send({
      message: err.message,
    })
  }
}

const createCliente = async (req, res) => {
  return createUser(req, res, "CLIENTE");
}

const createGerente = async (req, res) => {
  return createUser(req, res, "GERENTE");
}

module.exports = {
  createCliente,
  createGerente,
  getAll
}