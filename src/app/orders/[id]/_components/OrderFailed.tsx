import { currencyUtil } from '@/src/uilts/currency'
import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  CardFooter,
  Button
} from '@nextui-org/react'
import { Order } from '@prisma/client'
import moment from 'moment'
import Link from 'next/link'
import { Charges } from 'omise'
import SadFill from '@/src/assets/svgs/sad-fill.svg'

type Props = {
  order: Order
  charge: Charges.ICharge
}

export default function OrderFailed({ order, charge }: Props) {
  return (
    <Card className="px-5 w-full" shadow="md">
      <CardHeader className="flex-col items-center">
        <SadFill className="w-20 h-20 text-red-500" />
        <h1 className="text-large font-bold uppercase">Order failed</h1>
        <p className="text-default-500">We cannot process your payment.</p>
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
