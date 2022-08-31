export interface UserModel {
	_id: string;
	email: string;
	username: string;
}

export interface SocialMediaData {
	provider: string;
	id: string;
	username: string;
	picture: string | null;
	access_token: string;
	refresh_token?: string;
}

export interface SocialHasAccess {
	provider: string;
	has_access: boolean;
}

export interface MongoUserModel extends UserModel {
	password: string;
	socials: SocialMediaData[];
}

export interface UserSignInModel {
	username_or_email: string;
	password: string;
}

export interface UserSignUpModel extends UserSignInModel {
	repeat_password: string;
}

export interface SignInData {
	username_or_email: string;
	password: string;
}

export interface SignUpData {
	email: string;
	username: string;
	password: string;
	confirm_password: string;
}
