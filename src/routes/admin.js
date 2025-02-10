const express= require("express");
const adminRouter= express.Router();

const{IRCTC_ADMIN_KEY}= require("../config/config");
const{ validateSignUpDataAdmin, validateAddTrainData}= require("../utils/validation");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const validator= require("validator");
const{ adminAuth}= require("../middlewares/auth");
const{ pool}= require("../config/database");
const {JWT_SECRET}= require("../config/config");


adminRouter.post("/admin/signup", async(req, res)=>{
    let connection;
    try{
        const{name, emailId, password, adminKey}= req.body;
        const isAdminApiKeyValid= adminKey===IRCTC_ADMIN_KEY;
        if(isAdminApiKeyValid==false){
            return res.status(403).json({
                message: "Restricted Access Only , BY ADMINS"
            });    
        }
        validateSignUpDataAdmin(req);
        
        const passwordHash= await bcrypt.hash(password, 10);
        connection =await pool.getConnection();
        const query= "INSERT INTO ADMINS (name, emailid, password) VALUES (?, ?, ?)";
        await connection.execute(query, [name, emailId, passwordHash]);
        res.status(201).json({
            message: "Admin registered Successfully"
        });

    }catch(err){
        return res.status(500).json({
            ERROR: err.message
        });
    }finally{
        if(connection) await connection.release();
    }
});

adminRouter.post("/admin/login", async(req, res)=>{
    let connection;
    try{
        const{emailId, password, adminKey}= req.body;

        if(validator.isEmail(emailId)==false){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        };

        const isAdminApiKeyValid= adminKey===IRCTC_ADMIN_KEY;
        if(isAdminApiKeyValid==false){
            return res.status(403).json({
                message: "Restricted Access Only , BY ADMINS"
            });    
        }

        connection=await pool.getConnection();
        const query= "SELECT * FROM ADMINS WHERE emailId= ?";
        const [rows]=await connection.execute(query, [emailId]);
        if(rows.length==0){
            return res.status(404).json({
                message: "Restricted Access Only , BY ADMINS"
            });
        }
        const admin=rows[0];

        const isPasswordValid= await bcrypt.compare(password, admin.password);
        
        if(isPasswordValid){
            const token=await jwt.sign({adminId: admin.adminId}, JWT_SECRET, {expiresIn: "7d"});
            res.cookie("token", token);
            return res.status(200).json({
                message: "Admin logged in successfully"
            });
        }else{
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }


    }catch(err){
        res.status(500).json({ERROR:err.message});
    }finally{
        if(connection) await connection.release();
    }


});

adminRouter.post("/admin/logout", async(req, res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("Logout successfull");
});

adminRouter.post("/admin/addTrain", adminAuth, async(req, res)=>{
    let connection;
    try{
        validateAddTrainData(req);
        const{trainId, source, destination, seats}= req.body;
        connection= await pool.getConnection();
        const query="INSERT INTO TRAINS (trainId, source, destination, seats) VALUES(?,?,?,?)";
        await connection.execute(query, [trainId, source, destination, seats]);
        return res.status(201).json({
            message: "Train Added successfully",
            data: `${trainId} source- ${source}, destination- ${destination}, number of seats- ${seats}`
        });
    }catch(err){
        return res.status(500).json({
            ERROR: err.message
        });
    }finally{
        if(connection) connection.release();
    }
});

module.exports={adminRouter};