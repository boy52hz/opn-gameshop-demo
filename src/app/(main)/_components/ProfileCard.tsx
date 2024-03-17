import {
  Card,
  CardHeader,
  Avatar,
  Button,
  Divider,
  CardBody
} from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import SignOutBtn from './SignOutBtn'
import { auth } from '@/src/libs/auth'
import PointsChip from '@/src/components/PointsChip'

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
          <PointsChip points={user.points} />
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
