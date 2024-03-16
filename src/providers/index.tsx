'use client'

import { NextUIProvider } from '@nextui-org/react'
import NextAuthSessionProvider from './NextAuthSessionProvider'
import { ToastContainer } from 'react-toastify'

type Props = {
  children: React.ReactNode
}

export default function Providers({ children }: Props) {
  return (
    <NextAuthSessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
      <ToastContainer />
    </NextAuthSessionProvider>
  )
}
