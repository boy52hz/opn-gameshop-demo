import { Order } from '@prisma/client'
import { Charges } from 'omise'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider
} from '@nextui-org/react'
import CheckCircle from '@/src/assets/svgs/check-circle.svg'
import Link from 'next/link'
import Coin from '@/src/assets/svgs/coin.svg'
import moment from 'moment'
import { currencyUtil } from '@/src/uilts/currency'

type Props = {
  order: Order
  charge: Charges.ICharge
}

export default function OrderComplete({ order, charge }: Props) {
  return (
    <Card className="px-5 w-full" shadow="md">
      <CardHeader className="flex-col items-center">
        <CheckCircle className="w-20 h-20 text-green-500" />
        <h1 className="text-large font-bold uppercase">Thank you</h1>
        <p className="text-default-500">
          Your payment has been successfully processed.
        </p>
      </CardHeader>
      <Divider />
      <CardBody className="gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Order ID</div>
            <p>{order.id}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">Paid at</div>
            <p>{moment(charge.paid_at).format('YYYY-MM-DD HH:mm A')}</p>
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
      <Divider />
      <CardFooter>
        <Link className="block w-full" href="/">
          <Button variant="flat" color="primary" fullWidth>
            Back to shop
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
