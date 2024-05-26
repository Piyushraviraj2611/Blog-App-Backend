const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const ErrorHandler = require('../utils/errorHandler');

const registerUser = async (req, res) => {
	try {
		const { fullName, email, phone, password } = req.body;
		console.log(fullName, email, phone, password);
		// Check if user already registered
		const user = await User.findOne({ email });
		console.log(user);
		if (user) {
			return res.status(400).json({
				success: false,
				message: 'User already registered',
			});
		}

		const newUser = await User.create({ fullName, email, phone, password });

		res.status(201).json({
			success: true,
			message: 'User registered successfully',
			newUser,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	console.log(email, password);
	try {
		// Check if email and password is entered by user
		if (!email || !password) {
			return next(new ErrorHandler('Please enter email & password', 400));
		}

		// Finding user in database
		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid Email or Password',
			});
		}

		// Check if password is correct or not
		const isPasswordMatched = user.password === password;

		if (!isPasswordMatched) {
			return res.status(401).json({
				success: false,
				message: 'Invalid Email or Password',
			});
		}
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_TIME,
		});

		res.status(200).json({
			success: true,
			message: 'User Logged in successfully',
			user: {
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
				phone: user.phone,
				token,
				role: user.role,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = {
	registerUser,
	loginUser,
};
