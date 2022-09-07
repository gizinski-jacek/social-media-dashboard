// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';
import yupValidation from '../../../lib/yupValidation';
import connectMongo from '../../../lib/mongoose';
import User from '../../../models/user';
import bcryptjs from 'bcryptjs';
import { SignUpData, UserModel } from '../../../types/myTypes';
import nc from 'next-connect';

const userSignUpValidationSchema: Yup.SchemaOf<SignUpData> = Yup.object().shape(
	{
		email: Yup.string()
			.trim()
			.min(4, 'Email min length 4 characters')
			.max(32, 'Email max length 32 characters')
			.email('Invalid email format')
			.test('email-taken', 'Email is already taken', async (value) => {
				const account_list: UserModel[] = await User.find({
					email: value,
				}).exec();
				return account_list.length === 0;
			})
			.required('Email is required'),
		username: Yup.string()
			.trim()
			.min(4, 'Username min length 4 characters')
			.max(32, 'Username max length 32 characters')
			.test('username-taken', 'Username is already taken', async (value) => {
				const account_list: UserModel[] = await User.find({
					username: value,
				}).exec();
				return account_list.length === 0;
			})
			.required('Username is required'),
		password: Yup.string()
			.trim()
			.min(4, 'Password min length 4 characters')
			.max(32, 'Password max length 32 characters')
			.required('Password is required'),
		repeat_password: Yup.string()
			.trim()
			.min(4, 'Repeat password min length 4 characters')
			.max(32, 'Repeat password max length 32 characters')
			.oneOf([Yup.ref('password')], 'Passwords do not match')
			.required('Repeat password is required'),
	}
);

const handler = nc<NextApiRequest, NextApiResponse>({
	onError: (err, req, res, next) => {
		console.error(err.stack);
		return res.status(500).end('Something broke!');
	},
	onNoMatch: (req, res) => {
		return res.status(404).end('Page not found');
	},
}).post(async (req, res, next) => {
	try {
		const { errors } = await yupValidation(
			userSignUpValidationSchema,
			req.body
		);
		if (errors) {
			return res.status(422).json(errors);
		}
		const { email, username, password } = req.body;
		await connectMongo();
		const hashedPassword = await bcryptjs.hash(password, 5);
		const newUser = new User({
			email: email,
			username: username,
			password: hashedPassword,
		});
		const savedUser = await newUser.save();
		if (!savedUser) {
			return res.status(404).json('Error creating user');
		}
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(404).json('Unknown error');
	}
});

export default handler;
