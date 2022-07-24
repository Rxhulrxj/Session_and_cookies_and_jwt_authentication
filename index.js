//basic session and cookie

const express = require("express");
const cookieParser = require("cookie-parser");
//setup express app
const app = express();

// let’s you use the cookieParser in your application
app.use(cookieParser());

//a get route for adding a cookie
//insecure way
app.get("/setcookie", (req, res) => {
  res.cookie(`Cookie token name`, `encrypted cookie string Value`);
  res.send("Cookie have been saved successfully");
});
//secure way
app.get("/setcookie", (req, res) => {
  res.cookie(`Cookie token name`, `encrypted cookie string Value`, {
    maxAge: 5000,
    // expires works the same as the maxAge
    expires: new Date("01 10 2022"),
    secure: true,
    httpOnly: true,
    sameSite: "lax",
  });
  res.send("Cookie have been saved successfully");
});
app.get("/getcookie", (req, res) => {
  //show the saved cookies
  console.log(req.cookies);
  res.send(req.cookies);
});

// delete the saved cookie
app.get("/deletecookie", (req, res) => {
  //show the saved cookies
  res.clearCookie();
  res.send("Cookie has been deleted successfully");
});
app.listen(3000, () => console.log("The server is running port 3000..."));
