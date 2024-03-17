'use server'

import { MAX_TOPUP_AMOUNT, MIN_TOPUP_AMOUNT } from '@/src/constants/topup'
import { auth } from '@/src/libs/auth'
import { omise } from '@/src/libs/omise'
import { prisma } from '@/src/libs/prisma-client'
import { currencyUtil } from '@/src/uilts/currency'
import { OrderStatus } from '@prisma/client'
import moment from 'moment'
import { customAlphabet } from 'nanoid'
import { redirect } from 'next/navigation'
import { Charges } from 'omise'

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
    return {
      success: false,
      message: 'Unauthorized user'
    }
  }
  const zeroDecimalAmount = currencyUtil.toZeroDecimalAmount(amount)
  if (
    zeroDecimalAmount < MIN_TOPUP_AMOUNT ||
    zeroDecimalAmount > MAX_TOPUP_AMOUNT
  ) {
    return {
      success: false,
      message: 'Invalid amount'
    }
  }

  let chargeConfig: Charges.IRequest = {
    amount,
    currency
  }

  if (nounce.startsWith('tokn_')) {
    chargeConfig.card = nounce
  } else {
    chargeConfig.source = nounce
  }

  const [newOrder, newCharge] = await prisma.$transaction(async (tx) => {
    const nanoid = customAlphabet('1234567890abcdef', 10)
    const orderId = `ORDER-${moment().format('YYYYMMDD')}-${nanoid()}`

    let newCharge: Charges.ICharge

    try {
      newCharge = await omise.charges.create({
        ...chargeConfig,
        return_uri: `https://${process.env.HOST}/orders/${orderId}`,
        metadata: {
          orderId
        }
      })
    } catch (error) {
      console.error('Error creating charge', error)
      throw new Error('Failed to create charge')
    }

    const newOrder = await tx.order.create({
      data: {
        id: orderId,
        userId: session.user.id,
        points: zeroDecimalAmount,
        omiseChargeId: newCharge.id,
        // If charge is paid then set status to completed, otherwise leave it undefined for default status
        status: newCharge.paid ? OrderStatus.COMPLETED : undefined
      }
    })

    if (newCharge.paid) {
      await tx.user.update({
        where: {
          id: session.user.id
        },
        data: {
          points: {
            increment: zeroDecimalAmount
          }
        }
      })
    }

    return [newOrder, newCharge]
  })

  if (!newOrder) {
    return {
      success: false,
      message: 'Failed to create order'
    }
  }

  redirect(newCharge.authorize_uri)
}
