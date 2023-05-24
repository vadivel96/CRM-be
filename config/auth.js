const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRound = 10;
const secretKey = 'Qw3$er5ty6&7Uio8*9P';

const hashPassword = async (password)=>{
    let salt = await bcrypt.genSalt(saltRound)
    console.log(salt);
    let hash = await bcrypt.hash(password,salt)
    console.log(hash);
    return hash
}

const hashCompare = (password, hash)=>{
    return bcrypt.compare(password,hash) 
}

const createToken = ({ firstName,lastName,email, role})=>{
    let token = jwt.sign({firstName,lastName, email, role},secretKey,{expiresIn:'30m'})
    return token
}

const decodeToken = (token)=>{
    let data = jwt.decode(token)
    return data
}

const validate = async (req,res,next)=>{
    try {
        if(req.headers.authorization)
        {
            let token = req.headers.authorization.split(" ")[1]
            let data = decodeToken(token)
            console.log(data);
            if((Math.floor(Date.now()/1000))<=data.exp)
                next()
            else
                res.status(401).send({message:"Token Expired"})
        }
        else
        {
            res.status(401).send({message:"Token Not Found in validate middleware"})
        }
    } catch (error) {
        res.status(500).send({message:"Internal Server Error from validate",error})
    }
}



const roleManager = async(req,res,next)=>{
    try {
        
        if(req.headers.authorization)

        {
            let token = req.headers.authorization.split(" ")[1]
            let data = decodeToken(token)
            if(data.role === 'manager')
                next()
            else
                res.status(401).send({message:"Only manager can access"})
        }
        else
        {
            res.status(401).send({message:"Token Not Found"})
        }
    } catch (error) {
        res.status(500).send({message:"Internal Server Error",error})
    }

}

const roleAdmin = async(req,res,next)=>{
    try {
        if(req.headers.authorization)
        {
            let token = req.headers.authorization.split(" ")[1]
            let data = decodeToken(token)
            if( data.role==='manager' || data.role === 'admin' )
                next()
            else
                res.status(401).send({message:"Only Admin can access"})
        }
        else
        {
            res.status(401).send({message:"Token Not Found"})
        }
    } catch (error) {
        res.status(500).send({message:"Internal Server Error ",error})
    }

}

const roleEmployeeWithRights=async(req,res,next)=>{
    try {
        if(req.headers.authorization)
        {
            let token = req.headers.authorization.split(" ")[1]
            let data = decodeToken(token)
            if(data.role==='manager'||data.role==='admin'||data.role === 'employeeWithRights')
                next()
            else
                res.status(401).send({message:"Only employee with rights can access"})
        }
        else
        {
            res.status(401).send({message:"Token Not Found"})
        }
    } catch (error) {
        res.status(500).send({message:"Internal Server Error",error})
    }

}

const roleEmployeeWithoutRights=async(req,res,next)=>{
    try {
        if(req.headers.authorization)
        {
            let token = req.headers.authorization.split(" ")[1]
            let data = decodeToken(token)
            if(data.role==='manager'||data.role==='admin'||data.role === 'employeeWithRights'
              ||data.role === 'employeeWithoutRights')
                next();
            else
                res.status(401).send({message:"Only employees can access"})
        }
        else
        {
            res.status(401).send({message:"Token Not Found"})
        }
    } catch (error) {
        res.status(500).send({message:"Internal Server Error",error})
    }

}

const roleCustomer = async(req,res,next)=>{
    try {
        
        if(req.headers.authorization)

        {
            let token = req.headers.authorization.split(" ")[1]
            let data = decodeToken(token)
            if(data.role === 'customer')
                next()
            else
                res.status(401).send({message:"Registerd customers only can access"})
        }
        else
        {
            res.status(401).send({message:"Token Not Found in customer middleware"})
        }
    } catch (error) {
        res.status(500).send({message:"Internal Server Error",error})
    }

}


module.exports = {hashCompare,hashPassword,createToken,decodeToken,validate,
    roleAdmin,roleManager,roleEmployeeWithRights,roleEmployeeWithoutRights,roleCustomer,secretKey}