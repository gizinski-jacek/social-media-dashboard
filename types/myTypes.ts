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
	repeat_password: string;
}

export interface FacebookPost {
	id: string;
	created_time: string;
	object_id: string;
	permalink_url: string;
	from: { id: string; name: string };
	message?: string;
	timeline_visibility?: string;
	comments?: FacebookComment;
	attachments?: {
		data: {
			title?: string;
			description?: string;
			type: string;
			url: string;
			media: {
				image: { src: string; height: number; width: number };
			};
			subattachments?: {
				data: {
					description?: string;
					type: string;
					url: string;
					media: {
						image: { src: string; height: number; width: number };
					};
					target: {
						id: string;
						url: string;
					};
				}[];
			};
			target: {
				id: string;
				url: string;
			};
		}[];
	};
}

export interface FacebookComment {
	data: {
		id: string;
		created_time: string;
		message: string;
		from: { id: string; name: string };
	}[];
	paging: { cursors: { before: string; after: string } };
}

export interface InstagramPost {
	id: string;
	username: string;
	caption?: string;
	timestamp: string;
	media_type: string;
	media_url: string;
	permalink: string;
}
