import { prisma } from '@/src/libs/prisma-client'
import React from 'react'
import ProductList from './_components/ProductList'
import { auth } from '@/src/libs/auth'

export default async function Main() {
  const session = await auth()
  const products = await prisma.product.findMany()

  return <ProductList products={products} isPurchasable={!!session} />
}
