'use server'

import { auth } from '@/src/libs/auth'
import { omise } from '@/src/libs/omise'
import { prisma } from '@/src/libs/prisma-client'
import { Order, OrderStatus } from '@prisma/client'

export const createOrder = async ({
  nounce,
  currency,
  amount
}: {
  nounce: string
  currency: string
  amount: number
}) => {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('User not found')
  }

  let newOrder: Order | null = null

  try {
    newOrder = await prisma.order.create({
      data: {
        userId: session.user.id,
        points: amount / 100
      }
    })
  } catch (error) {
    throw new Error('Order failed to create')
  }

  let config = {}

  if (nounce.startsWith('tokn_')) {
    config = { card: nounce }
  } else {
    config = { source: nounce }
  }

  try {
    const newCharge = await omise.charges.create({
      amount,
      currency,
      metadata: {
        orderId: newOrder.id
      },
      ...config
    })
    console.log(
      'Charge created',
      newCharge.id,
      newCharge.paid,
      newCharge.metadata.orderId
    )

    return {
      success: true,
      message: 'Order has been created'
    }
  } catch (error) {
    await prisma.order.update({
      where: {
        id: newOrder.id
      },
      data: {
        status: OrderStatus.CANCELLED
      }
    })
    throw new Error('Order failed to charge')
  }
}
