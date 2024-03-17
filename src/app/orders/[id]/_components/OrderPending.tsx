'use client'

import { currencyUtil } from '@/src/uilts/currency'
import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  Chip,
  CardFooter,
  Image
} from '@nextui-org/react'
import { Order } from '@prisma/client'
import moment from 'moment'
import { Charges } from 'omise'
import Timer from '@/src/assets/svgs/timer.svg'
import Coin from '@/src/assets/svgs/coin.svg'
import { useEffect } from 'react'
import { pusherClient } from '@/src/libs/pusher'
import { useRouter } from 'next/navigation'
import { revalidateOrder } from '../actions'

type Props = {
  order: Order
  charge: Charges.ICharge
}

export default function OrderPending({ order, charge }: Props) {
  const router = useRouter()

  useEffect(() => {
    pusherClient.subscribe(order.id)

    const onChargeComplete = () => {
      console.log('Received charge.complete event')
      revalidateOrder(order.id)
      router.refresh()
    }

    pusherClient.bind('charge.complete', onChargeComplete)

    return () => {
      pusherClient.unbind('charge.complete', onChargeComplete)
      pusherClient.unsubscribe(order.id)
    }
  }, [order.id, router])

  return (
    <Card className="px-5 w-full" shadow="md">
      <CardHeader className="flex-col items-center">
        <Timer className="w-20 h-20 text-yellow-400" />
        <h1 className="text-large font-bold uppercase">Payment is pending</h1>
        <p className="text-default-500">Your payment is being processed.</p>
      </CardHeader>
      <Divider />
      <CardBody className="gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Order ID</div>
            <p>{order.id}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">Initiated at</div>
            <p>{moment(charge.created_at).format('YYYY-MM-DD HH:mm A')}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">Received points</div>
            <Chip color="warning" variant="flat" startContent={<Coin />}>
              {currencyUtil.format(order.points)}
            </Chip>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">Charged amount</div>
            <p className="text-large text-primary-500">
              {currencyUtil.format(
                currencyUtil.toZeroDecimalAmount(charge.amount),
                {
                  style: 'currency'
                }
              )}
            </p>
          </div>
        </div>
      </CardBody>
      {charge?.source && charge.source.type === 'promptpay' && (
        <>
          <Divider />
          <CardFooter className="flex-col items-center">
            <Image
              src={charge.source.scannable_code.image.download_uri}
              width={200}
              alt={`PromptPay QR code for ${charge.source.scannable_code.id}`}
            />
          </CardFooter>
        </>
      )}
    </Card>
  )
}
