import NextAuth from 'next-auth';
import authConfig from './auth.config';

export const { auth, signIn, signOut } = NextAuth(authConfig);

export const { handlers } = NextAuth(authConfig);
