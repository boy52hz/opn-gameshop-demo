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
import Coin from '@/src/assets/svgs/coin.svg'
import SignOutBtn from './SignOutBtn'
import { User } from '@prisma/client'
import { auth } from '@/src/libs/auth'
import { currencyUtil } from '@/src/uilts/currency'

export default async function ProfileCard() {
  const session = await auth()
  const user = session?.user

  if (!user) return null

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
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
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex items-center justify-between">
          <Chip color="warning" variant="flat" startContent={<Coin />}>
            {currencyUtil.format(user.points)}
          </Chip>
          <Link href="/topup">
            <Button color="primary" size="sm" variant="flat">
              Get Points
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}
