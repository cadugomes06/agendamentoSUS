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

//router
var routes = require('./routes');
app.use('/', routes);

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
