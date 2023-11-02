import {
    prisma
} from "@Lib/prisma";
import {
    compare
} from "bcryptjs";
import type {
    NextAuthOptions
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/",
    },
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                name: {
                    label: "user",
                    type: "text",
                    placeholder: "user",
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },
            async authorize(credentials) {
                if (!credentials?.name || !credentials.password) {
                    return null;
                }

                const user = await prisma.usuario.findUnique({
                    where: {
                        name: credentials.name,
                    },
                });

                if (!user || !(await compare(credentials.password, user.password))) {
                    return null;
                }

                const Session = {
                    id: String(user.id),
                    name: user.name,
                    randomKey: `${user.id}T3Tokem${user.name}`,
                    role: user.role
                }

                return Session
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    name: session.user?.name,
                    randomKey: token.randomKey,
                    role: token.role
                },
            };
        },
        jwt: ({ token, user }) => {

            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,
                    name: u?.name,
                    randomKey: u.randomKey,
                    role: u.role
                };
            }
            return token;
        },
    },
};
