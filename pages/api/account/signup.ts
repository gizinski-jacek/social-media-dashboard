// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';
import yupValidation from '../../../lib/yupValidation';
import connectMongo from '../../../lib/mongoose';
import User from '../../../models/user';
import bcryptjs from 'bcryptjs';
import {
	SignInData,
	SignUpData,
	UserSignInModel,
} from '../../../types/myTypes';

const userSignUpValidationSchema: Yup.SchemaOf<SignUpData> = Yup.object().shape(
	{
		email: Yup.string()
			.trim()
			.min(4, 'Email min length 4 characters')
			.max(32, 'Email max length 32 characters')
			.email('Invalid email format')
			.test('email-taken', 'Email is already taken', async (value) => {
				const account_list: SignInData[] = await User.find({
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
				const account_list: UserSignInModel[] = await User.find({
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
		confirm_password: Yup.string()
			.trim()
			.min(4, 'Confirm password min length 4 characters')
			.max(32, 'Confirm password max length 32 characters')
			.oneOf([Yup.ref('password')], 'Passwords do not match')
			.required('Confirm password is required'),
	}
);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
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
}
