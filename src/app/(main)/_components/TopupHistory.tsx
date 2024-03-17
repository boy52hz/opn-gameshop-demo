import { prisma } from '@/src/libs/prisma-client'
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  cn,
  Chip,
  CardFooter,
  Button
} from '@nextui-org/react'
import { OrderStatus } from '@prisma/client'
import moment from 'moment'
import Coin from '@/src/assets/svgs/coin.svg'
import { auth } from '@/src/libs/auth'
import { currencyUtil } from '@/src/uilts/currency'
import Link from 'next/link'
import OrderStatusChip from '@/src/components/OrderStatusChip'
import PointsChip from '@/src/components/PointsChip'

export default async function TopupHistory() {
  const session = await auth()

  if (!session?.user) return null

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  })

  return (
    <Card className="hidden lg:block">
      <CardHeader className="justify-between w-full">
        <div>Recent topup history</div>
        <Link href="/orders">
          <Button variant="light" color="primary">
            View all
          </Button>
        </Link>
      </CardHeader>
      <Divider />
      <CardBody className="max-h-[300px] overflow-auto">
        {orders.length > 0 ? (
          orders?.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center border-b last:border-none py-2"
            >
              <div className="flex items-center gap-3">
                <OrderStatusChip status={order.status} />
                <div className="text-xs text-default-500">
                  {moment(order.createdAt).format('YYYY-MM-DD HH:mm A')}
                </div>
              </div>
              <PointsChip points={order.points} />
            </div>
          ))
        ) : (
          <p className="text-default-500">No history</p>
        )}
      </CardBody>
    </Card>
  )
}
