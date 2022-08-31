import mongoose from 'mongoose';
import { MongoUserModel } from '../types/myTypes';
import validator from 'validator';

const Schema = mongoose.Schema;

const UserSchema = new Schema<MongoUserModel>(
	{
		email: {
			type: String,
			minlength: 4,
			maxlength: 32,
			trim: true,
			unique: true,
			required: true,
			validate: [validator.isEmail, 'Provide valid email'],
		},
		username: { type: String, minlength: 2, maxlength: 32, required: true },
		password: {
			type: String,
			minlength: 4,
			maxlength: 128,
			trim: true,
			unique: true,
			required: true,
			select: false,
		},
		socials: {
			select: false,
			_id: false,
			type: [
				{
					provider: {
						type: String,
						minlength: 4,
						maxlength: 32,
						required: true,
					},
					id: {
						type: String,
						minlength: 8,
						maxlength: 32,
						required: true,
					},
					username: {
						type: String,
						minlength: 8,
						maxlength: 128,
						required: true,
					},
					picture: { type: String, minlength: 8, maxlength: 128 },
					access_token: {
						type: String,
						minlength: 8,
						maxlength: 128,
						required: true,
					},
					refresh_token: { type: String, minlength: 8, maxlength: 128 },
				},
			],
		},
	},
	{ timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
