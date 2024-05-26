const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Please enter email'],
			trim: true,
			maxLength: [100, 'Email cannot exceed 100 characters'],
		},
		fullName: {
			type: String,
			required: [true, 'Please enter full name'],
			trim: true,
			maxLength: [100, 'Full name cannot exceed 100 characters'],
		},
		phone: {
			type: String,
			required: [true, 'Please enter phone number'],
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Please enter password'],
			minLength: [6, 'Password must be at least 6 characters'],
			select: false,
		},
		role: {
			type: String,
			default: 'user',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', userSchema);
