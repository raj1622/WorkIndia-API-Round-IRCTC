const express= require("express");
const userRouter= express.Router();

const{validateSignUpDataUser, validateBookingData, validateSeatAvailabilityData}= require("../utils/validation");
const bcrypt= require("bcrypt");
const validator= require("validator");
const jwt= require("jsonwebtoken");
const {JWT_SECRET}= require("../config/config");
const {userAuth}= require("../middlewares/auth");
const{pool}= require("../config/database");


userRouter.post("/user/signup", async(req, res)=>{
    let connection;
    try{
        const{name, emailId, password}= req.body;
        validateSignUpDataUser(req);
        
        const passwordHash= await bcrypt.hash(password, 10);
        connection =await pool.getConnection();
        const query= "INSERT INTO USERS (name, emailid, password) VALUES (?, ?, ?)";
        await connection.execute(query, [name, emailId, passwordHash]);
        res.status(201).json({
            message: "User registered Successfully"
        });

    }catch(err){
        return res.status(500).json({
            ERROR: err.message
        });
    }finally{
        if(connection) await connection.release();
    }
});

userRouter.post("/user/login", async(req, res)=>{
    let connection;
    try{
        const{emailId, password}=req.body;
        if(validator.isEmail(emailId)==false){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        };

        connection=await pool.getConnection();
        const query= "SELECT * FROM USERS WHERE emailId= ?";
        const [rows]=await connection.execute(query, [emailId]);
        if(rows.length==0){
            return res.status(404).json({
                message: "User does not exist !!!, please SignUp"
            });
        }
        const user=rows[0];
        const isPasswordValid= await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            const token=await jwt.sign({userId: user.userId}, JWT_SECRET, {expiresIn: "7d"});
            res.cookie("token", token);
            return res.status(200).json({
                message: "User logged in successfully"
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

userRouter.post("/user/logout", async(req, res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("Logout successfull");
});

userRouter.get("/user/getBookings", userAuth, async(req, res)=>{
    let connection;
    try{
        const userId=req.userId;
        connection= await pool.getConnection();
        const query="SELECT * FROM BOOKINGS WHERE userId= ?";

        const[rows]= await connection.execute(query, [userId]);
        if(rows.length==0){
            return res.status(404).json({ message: "No bookings found" });
        }else{
            return res.status(200).json({ bookings: rows });
        }
    }catch(err){
        return res.status(500).json({ERROR:err.message});
    }finally{
        if(connection) connection.release();
    }
});

userRouter.post("/user/book", userAuth, async(req, res)=>{
    let connection;
    try{
        const userId= req.userId;
        const{trainId, source, destination, seats}= req.body;

        validateBookingData(req);

        connection=await pool.getConnection();

        await connection.beginTransaction();

        const query1= "SELECT * FROM TRAINS WHERE trainId= ? FOR UPDATE";
        const[rows]= await connection.execute(query1, [trainId]);

        if(rows.length==0){
            return res.status(404).json({ error: "Entered train does not exist!" });
        }else if(rows[0].seats < seats){
            return res.status(400).json({ error: "Required number of seats are not available!" });
        }

        

        const query2= "INSERT INTO BOOKINGS (trainId, source,destination, seats, userId) VALUES (?,?,?,?,?)";
        await connection.execute(query2, [trainId ,source, destination, seats, userId]);
        const query3= "UPDATE TRAINS SET seats = seats - ? WHERE trainId = ?";
        await connection.execute(query3, [seats, trainId]);

        await connection.commit();

        res.status(201).json({
            message: `You have successfully booked ${seats} seats in train with id ${trainId} from ${source} to ${destination} . HAPPY JOURNEY!!!`
        });

    }catch(err){
        if (connection) await connection.rollback();
        return res.status(500).json({ERROR : err.message});
    }finally{
        if(connection) connection.release();
    }
});

userRouter.get("/user/getSeatAvailability/:source/:destination", userAuth, async(req, res)=>{
    let connection;
    try{
        
        const{source, destination}= req.params;

        validateSeatAvailabilityData(source, destination);
        connection= await pool.getConnection();
        const query= "SELECT * FROM TRAINS WHERE SOURCE=? AND DESTINATION=?";
        const[rows]= await connection.execute(query, [source, destination]);
        if(rows.length==0){
            return res.status(404).json({
                message: "No Train exists from entered source and destination"
            });
        }
        return res.status(200).json({
            data: rows
        });

    }catch(err){
        return res.status(500).json({ERROR: err.message});
    }finally{
        if(connection) connection.release();
    }
});

module.exports={userRouter};