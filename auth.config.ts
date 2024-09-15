import axios from 'axios';

import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        try {
          // Make a POST request to your backend /auth/login endpoint
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password
            }
          );

          console.log("response",response)

          const user = response.data;
          // If the login was successful and a token was returned
          if (user && user.token) {

            
            // Return an object with user data
            return {
              id: user.agent.id,
              name: user.agent.name,
              email: user.agent.email,
              token: user.token
            };
          } else {
            // Return null if user data could not be retrieved
            return null;
          }
        } catch (error) {
          // Handle errors (e.g., wrong credentials)
          console.error('Login error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login' // Adjust the sign-in page route
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // Persist the token from the user object
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Make the token available in the session
      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET // Ensure you have this in your .env file
};

export default authConfig;
