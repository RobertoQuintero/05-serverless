const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const Users = require('../models/Users')
const { isAuthenticated } = require('../auth')

const router = express.Router()

const signToken = _id => {
  return jwt.sign({ _id }, 'mi-secreto', {
    expiresIn: 60 * 60 * 24 * 355,
  })
}

router.post('/register', (req, res) => {
  const { email, password } = req.body
  crypto.randomBytes(16, (err, salt) => {//configuración para encriptar la contraseña
    const newSalt = salt.toString('base64')
    crypto.pbkdf2(password, newSalt, 1000, 64, 'sha1', (err, key) => {
      const encryptedPassword = key.toString('base64')
      Users.findOne({ email }).exec()//verificar si el correo ingresado está disponbile
        .then(user => {
          if (user) {
            return res.send('usuario ya existe')
          }
          Users.create({//crea usuario
            email,
            password: encryptedPassword,
            salt: newSalt
          }).then(() => {
            res.send('usuario creado con éxito')
          })
        })
    })
  })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  Users.findOne({ email }).exec()
    .then(user => {
      if (!user) {
        return res.send('Usuario y/o contraseña incorrecta')
      }
      crypto.pbkdf2(password, user.salt, 1000, 64, 'sha1', (err, key) => {
        const encryptedPassword = key.toString()//desencriptando la contraseña
        if (user.password === encryptedPassword) {
          const token = signToken(user._id)
          return res.send({ token })
        }
        res.send('Usuario y/o contraseña incorrecta')
      })
    })
})

router.get('/me',isAuthenticated,(req,res)=>{
  res.send(req.user)
})


module.exports = router