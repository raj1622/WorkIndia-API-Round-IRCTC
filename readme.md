WorkIndia SDE API Round - IRCTC

Overview:

This is a Node.js-based train booking application inspired by IRCTC. The system allows users to register, search for trains, book tickets, and manage their bookings. Admins can add trains between routes.

Features:

User

1. User Authentication (Singup/ Login)
2. Search for trains between source and destination
3. Book Train Tickets
4. View Booking History

Admin

1. Admin Authentication (Login and Signup)
2. Add Trains between source and Destination

Tech Stack:

Backend: Node.js, Express.js

Database: MYSQL


Prerequisites:

Ensure you have the following installed

1. NodeJS

2. MYSQL

3. Visual Studio Code

Installation Steps:

1. Clone the repository

https://github.com/raj1622/WorkIndia-API-Round-IRCTC.git

copy above link -> Go to vs code -> navigate to source control section in left menu -> click clone repository and paste the above url -> select the folder where you want to clone it -> open the folder in your local machine

2. Install dependencies

open terminal in vs code and navigate to root of project -> type  npm install 

3. Configure database

Navigate to IRCTC_BOOKING -> src -> config -> database.js

In connectDB() function , while creating a MYSQL Connection, replace the "user" and "password" with yours. as well as while creating mysql pool in same file.

4. Start the server

in terminal type, 

npm run dev

to start the server. Server will be running at PORT 3000

5. Test the API's

Use postman to test API's
eg:

localhost:3000/user/login

Request Body :

{

    "emailId" : "rohan1622@gmail.com",

    "password" : "Rohan@123"
    
}











API Endpoints:



#ADMIN API's



POST /admin/signup

Request Body:

{

    "name" : "Aryan Raj",

    "emailId" : "aryanraj1622@gmail.com",

    "password" : "Aryan@123",

    "adminKey" : "ADMIN12345"   // ALL ADMIN ROUTES ARE PROTECTED, USE "ADMIN12345" only to get access as admin

}



POST /admin/login

Request Body:

{

    "emailId" : "aryanraj1622@gmail.com",

    "password" : "Aryan@123",

    "adminKey" : "ADMIN12345"   // ALL ADMIN ROUTES ARE PROTECTED, USE "ADMIN12345" only to get access as admin
    
}



POST /admin/logout

Request Body:

{

}



POST /admin/addTrain

Request Body:

{

    "trainId" : 12765,

    "source" : "New Delhi",

    "destination" : "Mumbai",

    "seats" : 175
    
}



#USER API's



POST /user/signup

Request Body:

{

    "name" : "Rohan Sharma",

    "emailId" : "rohan1622@gmail.com",

    "password" : "Rohan@123",

}



POST /user/login

Request Body:

{

    "emailId" : "aryanraj1622@gmail.com",

    "password" : "Aryan@123",

}



POST /user/logout

Request Body:

{

}



POST /user/book

Request Body:

{

    "trainId" : 12765,

    "source" : "New Delhi",

    "destination" : "Mumbai",

    "seats" : 5

}



GET /user/getBookings

Request Body:

{

}



GET /user/getSeatAvailability/:source/:destination

Request Body:

{

}


