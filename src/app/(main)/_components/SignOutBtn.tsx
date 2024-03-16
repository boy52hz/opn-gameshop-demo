'use client'
import SignOut from '@/src/assets/svgs/signout.svg'
import { Button } from '@nextui-org/react'
import { signOut } from 'next-auth/react'

export default function SignOutBtn() {
  return (
    <Button
      className="bg-transparent text-red-600"
      isIconOnly
      size="sm"
      startContent={<SignOut className="text-xl" />}
      onPress={() => signOut()}
    />
  )
}
