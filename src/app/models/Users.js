const mongoose = require('mongoose')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

//estabelecendo os parametros de entrada dos dados 
const UsersSchema = new Schema({
    name:String,
    email:String,
    password:String
})

//criando o modelo mongoose
const User = mongoose.model('User',UsersSchema)


//criar um novo usuario no banco de dados
router.post('/',async (req,res)=>{
    //pegando os dados da requisição
    const {name,email,password} = req.body

    
    //verificando se tudo esta preechido
    if(!name||!email||!password){
        res.status(422).json({message:"erro ao criar usuario, insira todos os dados"})
        return
    }
    if(password.length<8){
        res.status(422).json({message:"erro ao criar usuario, senha deve conter no minimo 8 caracteres"})
        return
    }
    const user = {
        name,email,password
    }
    user.password = await bcrypt.hash(password,8)
    
    
    try {
        //criando o usuario
        await User.create(user)
        res.status(202).json({message:"Usuario criado com sucesso"})
        console.log('deu certo')
    } catch (error) {
        res.status(500).json({message:"erro ao criar usuario"})
    }
})
router.get('/',async (req,res)=>{
    try {
        //puxando todos os usuarios do banco de dados
        const Users = await User.find()
        //verificando se tem usarios no banco de dados
        if(!Users){
            res.status(422).json({message:"Nenhum usuario encontrado no banco de dados"})
            return
        }
        res.status(202).json(Users)
        console.log('deu certo')
    } catch (error) {
        res.status(500).json({message:"erro ao puxar usuarios"})
    }
})
router.get('/:id',async (req,res)=>{
    try {
        //puxando um usuario em especifico da base de dados
        const Userid = await User.findById(req.params.id)
        //verificando se foi encontrado algum usuario
        if(!Userid){
            res.status(422).json({message:"usuario não encontrado"})
            return
        }
        res.status(202).json(Userid)
        console.log('deu certo')
    } catch (error) {
        res.status(500).json({message:"erro ao puxar usuario"})
    }
})
router.patch('/:id',async (req,res)=>{
    //pegando os dados da requisição
    const {name,email,password} = req.body
    if(!name||!email||!password){
        res.status(422).json({message:"erro ao alterar usuario, insira todos os dados"})
        return
    }

    if(password.length<8){
        res.status(422).json({message:"erro ao criar usuario, senha deve conter no minimo 8 caracteres"})
        return
    }
    const user = {
        name,email,password
    }
    user.password = await bcrypt.hash(password,8)
    
    try {
        //puxando um usuario em especifico da base de dados
        const Userid = await User.updateOne({_id:req.params.id},user)
        //verificando se foi encontrado algum usuario
        if(Userid.matchedCount==0){
            res.status(422).json({message:"usuario não encontrado"})
            return
        }
        res.status(202).json({"message":"usuario alterado com sucesso"})
        console.log('deu certo')
        
    } catch (error) {
        res.status(500).json({message:"erro ao alterar usuario"})
    }
})
router.delete('/:id',async (req,res)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(422).json({message:"usuario não encontrado"})
            return
    }
    try {
        await User.deleteOne({_id:req.params.id})
        res.status(202).json({"message":"usuario deletado com sucesso"})
        console.log('deu certo')
        
    } catch (error) {z
        res.status(500).json({message:"erro ao deletar usuario"})
    }
})

//exportando o modulo
module.exports = router


