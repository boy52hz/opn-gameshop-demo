'use server'

import { prisma } from '@/src/libs/prisma-client'

export const getPaginatedOrdersByUserId = async ({
  userId,
  page,
  perPage
}: {
  userId: string
  page: number
  perPage: number
}) => {
  const orders = await prisma.order.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip: (page - 1) * perPage,
    take: perPage
  })
  const totalPages = Math.ceil((await prisma.order.count()) / perPage)

  return {
    data: orders,
    meta: {
      page,
      perPage,
      totalPages
    }
  }
}
