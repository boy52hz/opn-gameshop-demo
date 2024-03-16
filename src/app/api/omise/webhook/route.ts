import { omise } from '@/src/libs/omise'
import { prisma } from '@/src/libs/prisma-client'
import { OrderStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { Charges } from 'omise'

export const POST = async (req: Request) => {
  const { key: eventName, data } = await req.json()
  console.log('Webhook received', eventName)
  if (['charge.create', 'charge.complete'].includes(eventName)) {
    let charge = data as Charges.ICharge
    charge = await omise.charges.retrieve(charge.id)
    console.log(
      'Charge retrieved',
      charge.id,
      charge.paid,
      charge.metadata.orderId
    )
    if (!charge.paid) {
      console.log('Charge is not paid')
      return Response.json(
        {
          message: 'Charge is not paid',
          susscess: false
        },
        {
          status: 400
        }
      )
    }

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
      console.log('Order has been updated')
    })
  }
  revalidatePath('/')
  return Response.json(
    {
      success: true,
      message: 'Webhook has been processed'
    },
    {
      status: 200
    }
  )
}
