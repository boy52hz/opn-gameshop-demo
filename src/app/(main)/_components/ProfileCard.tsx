import {
  Card,
  CardHeader,
  Avatar,
  Button,
  Chip,
  Divider,
  CardBody
} from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import { User } from '@prisma/client'
import Coin from '@/src/assets/svgs/coin.svg'
import SignInWithGoogleBtn from './SignInWithGoogleBtn'
import SignOutBtn from './SignOutBtn'

type Props = {
  user?: User
}

export default function ProfileCard({ user }: Props) {
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        {user ? (
          <div className="flex justify-between w-full">
            <div className="flex gap-3 items-center">
              {user.image && <Avatar src={user.image} />}
              <div className="flex flex-col">
                <p className="text-md">{user.name}</p>
                <p className="text-xs text-default-500">{user.email}</p>
              </div>
            </div>
            <SignOutBtn />
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-md">Hello, Guest</p>
            <p className="text-small text-default-500">
              Please sign-in before purchase
            </p>
          </div>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        {user ? (
          <div className="flex items-center justify-between">
            <Chip color="warning" variant="flat" startContent={<Coin />}>
              {user.points.toLocaleString('th-TH')}
            </Chip>
            <Link href="/topup">
              <Button color="primary" size="sm" variant="flat">
                Get Points
              </Button>
            </Link>
          </div>
        ) : (
          <SignInWithGoogleBtn />
        )}
      </CardBody>
    </Card>
  )
}
