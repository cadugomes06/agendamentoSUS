require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var cors = require('cors')
const corsOptions ={
    origin:'http://localhost:3001', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}


const app = express()

// Config JSON response
app.use(express.json())
app.use(cors(corsOptions));
//Models
const User = require('./models/User')

// Public route - home
app.get('/', (req, res) => {
    res.status(200).json({msg: 'Essa é minha página home '})
}) 

// Private Route
app.get('/user/:id', checkToken, async (req, res) => {

    const id = req.params.id

    // Check if user exists
    const user = await User.findById(id, '-password')

    if(!user) {
        return res.status(404).json({msg: "Usuário não encontrado!"})
    }

    res.status(200).json({ user })
})

function checkToken(req, res, next) {
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        return res.status(401).json({msg: "Acesso negado"})
    }

    try {

        const secret = process.env.SECRET

        jwt.verify(token, secret)
        next()

    } catch(error) {
        res.status(400).json({msg: "token inválido!"})
    }
}

// Register User
app.post('/auth/register', async (req, res) => {

    const {name, email, password, confirmPassword} = req.body
    console.log(name, email, password, confirmPassword)
    //validations
    if(!name) {
        return res.status(422).json({msg: "O nome é obrigatório"})
    }
    if(!email) {
        return res.status(422).json({msg: "O email é obrigatório"})
    }
    if(!password) {
        return res.status(422).json({msg: "A senha é obrigatória"})
    }

    if (password != confirmPassword) {
        return res.status(422).json({msg: "As senhas não conferem!"})
    }

    //check if user exists
    const userExists = await User.findOne({email: email})
    
    if(userExists) {
        return res.status(422).json({msg: "Esse email ja está sendo utilizado"})
    }

    // Create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try {
        await user.save()

        res.status(201).json({msg: "Usuário criado com sucesso!"})

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Houve um error ao salvar o usuário"})
    }
    
})

// login user
app.post("/auth/login", async (req, res) => {

    const {email, password} = req.body

    if(!email) {
        return res.status(422).json({msg: "O email é inválido"})
    }
    if(!password) {
        return res.status(422).json({msg: "A senha não confere!"})
    }

    // check if user exists
    const user = await User.findOne({ email: email})

    if(!user) {
        return res.status(404).json({msg: "Usuário não cadastrado!"})
    }

    // Check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        console.log(checkPassword)
        return res.status(422).json({msg: "Senha inválida"})
    }

    try {
        
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: user._id
        }, secret,
        )

        res.status(200).json({msg: "Autenticado com sucesso!", token})

    } catch (err) {
        console.log(err)

        res.status(500).json({ msg: "Houve um erro inesperado."})
    }
})

// Credencials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

//DB mongoose
mongoose
 .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.grdm6md.mongodb.net/?retryWrites=true&w=majority`)
 .then(() => {
    app.listen(3000)
    console.log("conectou ao banco de dados com sucesso!")
}).catch((err) => console.log(err))
