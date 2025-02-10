const jwt= require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const {pool} = require("../config/database");

const userAuth= async(req, res, next)=>{
    let connection;
    try{
        const cookies= req.cookies;
        const{token}=cookies;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token is missing" });
        }
        const decodedObj= await jwt.verify(token, JWT_SECRET);
        const{userId}=decodedObj;
        if(!userId) return res.status(401).json({ message: "Unauthorized: Token is missing" });
        connection= await pool.getConnection();
        const query= "SELECT * FROM USERS WHERE userId= ?"
        const [rows]=await connection.execute(query, [userId]);
        
        if(rows.length==0){
            throw new Error("User not found");
        }
        req.userId=rows[0].userId;
        next();
    }catch(err){
        return res.status(500).json({ERROR: err.message});
    }finally{
        if(connection) await connection.release();
    }
}

const adminAuth = async(req, res, next)=>{
    let connection;
    try{
        const cookies= req.cookies;
        const{token}=cookies;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token is missing" });
        }
        const decodedObj= await jwt.verify(token, JWT_SECRET);
        const{adminId}=decodedObj;
        if(!adminId) return res.status(401).json({ message: "Unauthorized: Token is missing" }); 
        connection= await pool.getConnection();
        const query= "SELECT * FROM ADMINS WHERE adminId= ?"
        const [rows]=await connection.execute(query, [adminId]);
        
        if(rows.length==0){
            throw new Error("User not found");
        }
        req.adminId=rows[0].adminId;
        next();
    }catch(err){
        return res.status(500).json({ERROR: err.message});
    }finally{
        if(connection) await connection.release();
    }
}

module.exports={
    userAuth, adminAuth
}