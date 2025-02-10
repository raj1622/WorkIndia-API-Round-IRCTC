const express= require("express");
const app=express();

const cookieParser= require("cookie-parser");
const {userRouter}= require("./routes/user");
const{adminRouter}= require("./routes/admin");
const{ connectDB, pool}= require("./config/database");
app.use(express.json());
app.use(cookieParser());

app.use("/", userRouter);
app.use("/", adminRouter);

connectDB()
    .then(()=>{
        console.log("Successully conencted to the db");
        app.listen(3000, ()=>{
            console.log("Server listening on port 3000");
        });

    })
    .catch((err)=>{
        console.error("database connection failed");
    })
