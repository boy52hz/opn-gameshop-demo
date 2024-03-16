'use client'

import { Button } from '@nextui-org/react'

import Google from '@/src/assets/svgs/google.svg'
import { signIn } from 'next-auth/react'

export default function SignInWithGoogleBtn() {
  return (
    <Button
      className="bg-white text-primary border-2 border-primary-50"
      startContent={<Google />}
      onPress={() => signIn('google')}
    >
      Sign in with Google
    </Button>
  )
}
