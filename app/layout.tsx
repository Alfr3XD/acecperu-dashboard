import type { Metadata } from 'next'
import { Montserrat as Font } from 'next/font/google';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@Lib/auth';
import Provider from '@Components/provider';

import '@Styles/global.css';

const font = Font({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Dashboard AcecPerú"
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className={font.className}>
        <Provider
          session={session}
        >
          {children}
        </Provider>
      </body>
    </html>
  )
}
