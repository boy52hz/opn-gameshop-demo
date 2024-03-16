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
  console.log(productId, user.id, user.points)
  if (!user) {
    throw new Error('User not found')
  }

  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId
    }
  })

  if (!product) {
    throw new Error('Product not found')
  }

  if (user.points < product.price) {
    throw new Error('Insufficient points')
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
    revalidatePath('/')
    return {
      success: true,
      message: 'Product has been purchased'
    }
  } catch (error) {
    throw new Error('Failed to update user points')
  }
}
