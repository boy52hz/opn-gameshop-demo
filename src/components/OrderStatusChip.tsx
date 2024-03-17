import { Chip, cn } from '@nextui-org/react'
import { OrderStatus } from '@prisma/client'
import React from 'react'

type Props = {
  status: OrderStatus
}

export default function OrderStatusChip({ status }: Props) {
  return (
    <Chip
      variant="flat"
      className={cn('capitalize text-white', {
        'bg-green-200 text-green-500': status === OrderStatus.COMPLETED,
        'bg-yellow-200 text-yellow-500': status === OrderStatus.PENDING,
        'bg-red-200 text-red-500': status === OrderStatus.CANCELLED
      })}
    >
      {
        {
          COMPLETED: 'Paid',
          PENDING: 'Pending',
          CANCELLED: 'Cancelled'
        }[status]
      }
    </Chip>
  )
}
