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

API Endpoints:

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
    "emailId" :"aryanraj1622@gmail.com",
    "password" "Aryan@123",
    "adminKey" :"ADMIN12345"  // ALL ADMIN ROUTES ARE PROTECTED, USE "ADMIN12345" only to get access as admin
}





