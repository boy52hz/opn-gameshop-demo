import { prisma } from '@/src/libs/prisma-client'
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  cn,
  Chip
} from '@nextui-org/react'
import { OrderStatus } from '@prisma/client'
import moment from 'moment'
import Coin from '@/src/assets/svgs/coin.svg'
import { auth } from '@/src/libs/auth'
import { currencyUtil } from '@/src/uilts/currency'

export default async function TopupHistory() {
  const session = await auth()

  if (!session?.user) return null

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <Card>
      <CardHeader>Topup History</CardHeader>
      <Divider />
      <CardBody className="max-h-[300px] overflow-auto">
        {orders.length > 0 ? (
          orders?.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center border-b last:border-none py-2"
            >
              <div className="flex items-center gap-3">
                <Chip
                  variant="flat"
                  className={cn('capitalize text-white', {
                    'bg-green-200 text-green-500':
                      order.status === OrderStatus.COMPLETED,
                    'bg-yellow-200 text-yellow-500':
                      order.status === OrderStatus.PENDING,
                    'bg-red-200 text-red-500':
                      order.status === OrderStatus.CANCELLED
                  })}
                >
                  {
                    {
                      COMPLETED: 'Paid',
                      PENDING: 'Pending',
                      CANCELLED: 'Cancelled'
                    }[order.status]
                  }
                </Chip>
                <div className="text-xs text-default-500">
                  {moment(order.createdAt).format('YYYY-MM-DD HH:mm A')}
                </div>
              </div>

              <Chip
                className="self-end"
                color="warning"
                variant="flat"
                startContent={<Coin />}
              >
                {currencyUtil.format(order.points)}
              </Chip>
            </div>
          ))
        ) : (
          <p className="text-default-500">No history</p>
        )}
      </CardBody>
    </Card>
  )
}
