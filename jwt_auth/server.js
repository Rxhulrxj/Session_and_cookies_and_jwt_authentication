// Importing modules
const express = require("express");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const User = require("./models/userModel");

const app = express();

app.use(express.json());

// Handling post request
app.post("/login", async (req, res, next) => {
let { email, password } = req.body;

let existingUser;
try {
	existingUser = await User.findOne({ email: email });
} catch {
	const error = new Error("Error! Something went wrong.");
	return next(error);
}
if (!existingUser || existingUser.password != password) {
	const error = Error("Wrong details please check at once");
	return next(error);
}
let token;
try {
	//Creating jwt token
	token = jwt.sign(
	{ userId: existingUser.id, email: existingUser.email },
	"secretkeyappearshere",
	{ expiresIn: "1h" }
	);
} catch (err) {
	console.log(err);
	const error = new Error("Error! Something went wrong.");
	return next(error);
}

res
	.status(200)
	.json({
	success: true,
	data: {
		userId: existingUser.id,
		email: existingUser.email,
		token: token,
	},
	});
});

// Handling post request
app.post("/signup", async (req, res, next) => {
const { name, email, password } = req.body;
const newUser = User({
	name,
	email,
	password,
});

try {
	await newUser.save();
} catch {
	const error = new Error("Error! Something went wrong.");
	return next(error);
}
let token;
try {
	token = jwt.sign(
	{ userId: newUser.id, email: newUser.email },
	"secretkeyappearshere",
	{ expiresIn: "1h" }
	);
} catch (err) {
	const error = new Error("Error! Something went wrong.");
	return next(error);
}
res
	.status(201)
	.json({
	success: true,
	data: { userId: newUser.id,
		email: newUser.email, token: token },
	});
});
app.get("/",(req,res)=>{
    res.send('api is working')
})
app.get('/accessResource', (req, res)=>{
	const token = req.headers.authorization.split(' ')[1];
	//Authorization: 'Bearer TOKEN'
	if(!token)
	{
		res.status(200).json({success:false, message: "Error!Token was not provided."});
	}
	//Decoding the token
	const decodedToken = jwt.verify(token,"secretkeyappearshere" );
	res.status(200).json({success:true, data:{userId:decodedToken.userId,
	email:decodedToken.email}});
})


//Connecting to the database
mongoose
.connect("mongodb+srv://<Yourusername>:<Yourpassword>@cluster0.zip3izl.mongodb.net/?retryWrites=true&w=majority")
.then(() => {
	app.listen("3000", () => {
	console.log("Server is listening on port 3000");
	});
})
.catch((err) => {
	console.log("Error Occurred");
});
