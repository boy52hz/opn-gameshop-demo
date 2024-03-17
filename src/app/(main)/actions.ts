'use server'

import { auth } from '@/src/libs/auth'
import { prisma } from '@/src/libs/prisma-client'
import { revalidatePath } from 'next/cache'

export const purchaseProduct = async (productId: string) => {
  const session = await auth()

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session?.user.id
    }
  })

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    }
  }

  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId
    }
  })

  if (!product) {
    return {
      success: false,
      message: 'Product not found'
    }
  }

  if (user.points < product.price) {
    return {
      success: false,
      message: 'Insufficient points'
    }
  }

  try {
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        points: {
          decrement: product.price
        }
      }
    })
    revalidatePath('/', 'layout')
    return {
      success: true,
      message: 'Product has been purchased'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update user points'
    }
  }
}
