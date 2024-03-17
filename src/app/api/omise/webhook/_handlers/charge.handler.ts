import { prisma } from '@/src/libs/prisma-client'
import { pusher } from '@/src/libs/pusher'
import { OrderStatus } from '@prisma/client'
import { Charges } from 'omise'

export const handleChargeComplete = async (charge: Charges.ICharge) => {
  const status = (charge as any).status as IChargeStatus
  if (!charge.metadata?.orderId) throw new Error('Order ID not found')
  if (status === 'successful') {
    await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: {
          id: charge.metadata.orderId
        },
        data: {
          status: OrderStatus.COMPLETED
        }
      })
      await tx.user.update({
        where: {
          id: updatedOrder.userId
        },
        data: {
          points: {
            increment: updatedOrder.points
          }
        }
      })
    })
    await pusher.trigger(charge.metadata.orderId, 'charge.complete', {})
  } else if (status === 'failed' || status === 'expired') {
    await prisma.order.update({
      where: {
        id: charge.metadata.orderId
      },
      data: {
        status: OrderStatus.CANCELLED
      }
    })
    await pusher.trigger(charge.metadata.orderId, 'charge.complete', {})
  }
}
