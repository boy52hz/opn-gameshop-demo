'use client'

import {
  Card,
  CardHeader,
  Avatar,
  Button,
  Chip,
  Divider,
  CardBody,
  Skeleton
} from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import Coin from '@/src/assets/svgs/coin.svg'
import SignOutBtn from './SignOutBtn'
import { useSession } from 'next-auth/react'

export default function ProfileCard() {
  const { data: session } = useSession()
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        {session?.user ? (
          <div className="flex justify-between w-full">
            <div className="flex gap-3 items-center">
              {session.user.image && <Avatar src={session.user.image} />}
              <div className="flex flex-col">
                <p className="text-md">{session.user.name}</p>
                <p className="text-xs text-default-500">{session.user.email}</p>
              </div>
            </div>
            <SignOutBtn />
          </div>
        ) : (
          <div className="max-w-[300px] w-full flex items-center gap-3">
            <div>
              <Skeleton className="flex rounded-full w-12 h-12" />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-3 w-3/5 rounded-lg" />
              <Skeleton className="h-3 w-4/5 rounded-lg" />
            </div>
          </div>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex items-center justify-between">
          <Chip color="warning" variant="flat" startContent={<Coin />}>
            {session?.user.points.toLocaleString('th-TH') || 0}
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
