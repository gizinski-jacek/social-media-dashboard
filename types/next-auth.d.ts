import NextAuth, { DefaultSession } from 'next-auth';
import { UserModel } from './myTypes';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		'types/*.ts';
		user?: UserModel & DefaultSession['user'];
	}
}
