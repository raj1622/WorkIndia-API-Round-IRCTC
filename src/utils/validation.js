const validator= require("validator");

const validateSignUpDataUser= (req) => {
    const{name, emailId, password}= req.body;
    if(name.length<3 || name.length>20){
        throw new Error("Name is not valid");
    }else if(validator.isEmail(emailId)==false){
        throw new Error("EmailId is not valid");
    }else if(validator.isStrongPassword(password)==false){
        throw new Error("Enter Strong password");
    }
};

const validateSignUpDataAdmin= (req) => {
    const{name, emailId, password, adminKey}=req.body;
    if(name.length<3 || name.length>20){
        throw new Error("Name is not valid");
    }else if(validator.isEmail(emailId)==false){
        throw new Error("EmailId is not valid");
    }else if(validator.isStrongPassword(password)==false){
        throw new Error("Enter Strong password");
    }
};

const validateAddTrainData= (req)=>{
    const{trainId, source, destination, seats}=req.body;
    if(source.length<3 || source.length >20){
        throw new Error("Source is not valid");
    }else if(destination.length<3 || destination.length>20){
        throw new Error("Destination is not valid");
    }else if(seats<1 || seats >1000){
        throw new Error("Enter valid number of seats");
    }
};

const validateSeatAvailabilityData= (source, destination)=>{
    if(source.length<3 || source.length >20){
        throw new Error("Source is not valid");
    }else if(destination.length<3 || destination.length>20){
        throw new Error("Destination is not valid");
    }
}

const validateBookingData= (req)=>{
    const{trainId, source, destination, seats}= req.body;
    if(source.length<3 || source.length >20){
        throw new Error("Source is not valid");
    }else if(destination.length<3 || destination.length>20){
        throw new Error("Destination is not valid");
    }else if(seats<1 || seats>50){
        throw new Error("Please Enter valid number of seats");
    }
}

module.exports={validateSignUpDataUser, validateSignUpDataAdmin, validateAddTrainData, validateBookingData, validateSeatAvailabilityData};

