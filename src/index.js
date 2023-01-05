const express = require('express');
const Users = require('./app/models/Users');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

//não sei oque essa parte faz mas sem ela o app quebra
app.use(
    express.urlencoded({
        extended:true
    })
)

app.use(express.json())


//rotas da api
app.use('/users',Users)

//rota raiz
app.use('/',(req,res)=>{
    res.status(200).json({message:"ola"})
})

//pegando informações guardadas em um arquivo .env

const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS

//conectando ao mongodb via mongoose
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@varnahal.wu5lufq.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>{
console.log('conectamos ao mongodb')
})
.catch((e)=>{
    console.log(e)
})
app.listen(3000,()=>{console.log('servidor rodando na porta 3000')})