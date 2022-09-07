import type { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
	InputLabel,
} from '@mui/material';
import styles from '../styles/Home.module.scss';
import { SignInData, SignUpData } from '../types/myTypes';
import { defaultSignInValues, defaultSignUpValues } from '../lib/defaults';

const Home: NextPage = () => {
	const { data: user } = useSession();

	const router = useRouter();

	const [showForm, setShowForm] = useState('signIn');
	const [signInData, setSignInData] = useState<SignInData>(defaultSignInValues);
	const [signUpData, setSignUpData] = useState<SignUpData>(defaultSignUpValues);
	const [recoverAccountData, setRecoverAccountData] = useState('');
	const [signInFormError, setSignInFormError] = useState<string[]>([]);
	const [signUpFormError, setSignUpFormError] = useState<string[]>([]);
	const [recoverAccountError, setRecoverAccountError] = useState<string[]>([]);

	const handleResetFormsAndErrors = () => {
		setSignInData(defaultSignInValues);
		setSignUpData(defaultSignUpValues);
		setRecoverAccountData('');
		setSignInFormError([]);
		setSignUpFormError([]);
		setRecoverAccountError([]);
	};

	const handleFormChange = (value: string) => {
		handleResetFormsAndErrors();
		setShowForm(value);
	};

	const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setSignInData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setSignUpData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleRecoverAccountChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { value } = e.target;
		setRecoverAccountData(value);
	};

	const handleSignInSubmit = async () => {
		const res = await signIn('credentials', {
			...signInData,
			redirect: false,
		});
		if (!res) {
			setSignInFormError(['Sign In error']);
			return;
		}
		if (res.ok) {
			router.push('/dashboard');
		} else {
			setSignInFormError(['Check credentials']);
		}
	};

	const handleSignUpSubmit = async () => {
		try {
			await axios.post('/api/account/signup', signUpData);
			handleResetFormsAndErrors();
			setShowForm('signIn');
		} catch (error: any) {
			setSignUpFormError([...error.response.data]);
		}
	};

	const handleRecoverAccountSubmit = async () => {
		try {
			await axios.post('/api/account/recover-account', {
				username_or_email: recoverAccountData,
			});
			handleResetFormsAndErrors();
			setShowForm('signIn');
		} catch (error: any) {
			console.log(error.response.data);
			setRecoverAccountError([error.response.data]);
		}
	};

	return (
		<div className={styles.container}>
			<div>
				<h2>Welcome {user?.user?.username}</h2>
			</div>
			{user ? null : (
				<div>
					{showForm === 'signIn' ? (
						<FormControl>
							<FormLabel sx={{ my: 1 }}>
								<h2>Sign In</h2>
							</FormLabel>
							<FormControl sx={{ m: 1 }}>
								<InputLabel htmlFor='username_or_email'>
									Username or Email
								</InputLabel>
								<Input
									id='username_or_email'
									name='username_or_email'
									type='text'
									inputProps={{ minLength: 4, maxLength: 32 }}
									value={signInData.username_or_email}
									onChange={handleSignInChange}
									placeholder='Username or Email'
									required
								/>
							</FormControl>
							<FormControl sx={{ m: 1 }}>
								<InputLabel htmlFor='password'>Password</InputLabel>
								<Input
									id='password'
									name='password'
									type='password'
									inputProps={{ minLength: 4, maxLength: 32 }}
									value={signInData.password}
									onChange={handleSignInChange}
									placeholder='Password'
									required
								/>
							</FormControl>
							{signInFormError.length !== 0 ? (
								<Box>
									{signInFormError.map((message, index) => (
										<FormHelperText sx={{ mx: 1, color: 'red' }} key={index}>
											{message}
										</FormHelperText>
									))}
								</Box>
							) : null}
							{signInFormError.length > 0 ? (
								<FormHelperText
									sx={{ m: 1, cursor: 'pointer', color: 'orange' }}
									onClick={() => handleFormChange('recoverAccount')}
								>
									Forgot password?
								</FormHelperText>
							) : null}
							<Button type='button' onClick={handleSignInSubmit}>
								Sign In
							</Button>
							<FormHelperText sx={{ m: 1 }}>Need an account?</FormHelperText>
							<Button type='button' onClick={() => handleFormChange('signUp')}>
								Sign Up
							</Button>
						</FormControl>
					) : showForm === 'signUp' ? (
						<FormControl>
							<FormLabel sx={{ my: 1 }}>
								<h2>Sign Up</h2>
							</FormLabel>
							<FormControl sx={{ m: 1 }}>
								<InputLabel htmlFor='email'>Email</InputLabel>
								<Input
									id='email'
									name='email'
									type='email'
									inputProps={{ minLength: 4, maxLength: 32 }}
									value={signUpData.email}
									onChange={handleSignUpChange}
									placeholder='Email'
									required
								/>
							</FormControl>
							<FormControl sx={{ m: 1 }}>
								<InputLabel htmlFor='username'>Username</InputLabel>
								<Input
									id='username'
									name='username'
									type='text'
									inputProps={{ minLength: 4, maxLength: 32 }}
									value={signUpData.username}
									onChange={handleSignUpChange}
									placeholder='Username'
									required
								/>
							</FormControl>
							<FormControl sx={{ m: 1 }}>
								<InputLabel htmlFor='password'>Password</InputLabel>
								<Input
									id='password'
									name='password'
									type='password'
									inputProps={{ minLength: 4, maxLength: 32 }}
									error={
										signUpData.password === signUpData.repeat_password
											? false
											: true
									}
									value={signUpData.password}
									onChange={handleSignUpChange}
									placeholder='Password'
									required
								/>
							</FormControl>
							<FormControl sx={{ m: 1 }}>
								<InputLabel htmlFor='repeat_password'>
									Repeat Password
								</InputLabel>
								<Input
									id='repeat_password'
									name='repeat_password'
									type='password'
									inputProps={{ minLength: 4, maxLength: 32 }}
									error={
										signUpData.password === signUpData.repeat_password
											? false
											: true
									}
									value={signUpData?.repeat_password}
									onChange={handleSignUpChange}
									placeholder='Repeat Password'
									required
								/>
							</FormControl>
							{signUpFormError.length !== 0 ? (
								<Box>
									{signUpFormError.map((message, index) => (
										<FormHelperText sx={{ mx: 1, color: 'red' }} key={index}>
											{message}
										</FormHelperText>
									))}
								</Box>
							) : null}
							<Button type='button' onClick={handleSignUpSubmit}>
								Register
							</Button>
							<FormControl>
								<FormHelperText sx={{ m: 1 }}>Forgot password?</FormHelperText>
								<Button
									type='button'
									onClick={() => handleFormChange('recoverAccount')}
								>
									Recover Account
								</Button>
								<FormHelperText sx={{ m: 1 }}>
									Already have an account?
								</FormHelperText>
								<Button
									type='button'
									onClick={() => handleFormChange('signIn')}
								>
									Sign In
								</Button>
							</FormControl>
						</FormControl>
					) : showForm === 'recoverAccount' ? (
						<FormControl>
							<FormLabel sx={{ my: 1 }}>
								<h2>Recover Account</h2>
							</FormLabel>
							<FormControl sx={{ m: 1 }}>
								<InputLabel htmlFor='username_or_email'>
									Username or Email
								</InputLabel>
								<Input
									id='username_or_email'
									name='username_or_email'
									type='text'
									inputProps={{ minLength: 4, maxLength: 32 }}
									value={recoverAccountData}
									onChange={handleRecoverAccountChange}
									placeholder='Username or Email'
									required
								/>
							</FormControl>
							{recoverAccountError.length !== 0 ? (
								<Box>
									{recoverAccountError.map((message, index) => (
										<FormHelperText sx={{ mx: 1, color: 'red' }} key={index}>
											{message}
										</FormHelperText>
									))}
								</Box>
							) : null}
							<Button type='button' onClick={handleRecoverAccountSubmit}>
								Recover
							</Button>
							<FormControl>
								<FormHelperText sx={{ m: 1 }}>
									Remember password?
								</FormHelperText>
								<Button
									type='button'
									onClick={() => handleFormChange('signIn')}
								>
									Sign In
								</Button>
								<FormHelperText sx={{ m: 1 }}>Need an account?</FormHelperText>
								<Button
									type='button'
									onClick={() => handleFormChange('signUp')}
								>
									Sign Up
								</Button>
							</FormControl>
						</FormControl>
					) : null}
				</div>
			)}
		</div>
	);
};

export default Home;
