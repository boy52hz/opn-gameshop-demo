'use client'

import { Product } from '@prisma/client'
import ProductListItem from './ProductListItem'
import { purchaseProduct } from '../actions'
import { toast } from 'react-toastify'
import ToastError from '@/src/components/ToastError'
import { useSession } from 'next-auth/react'

type Props = {
  products: Product[]
  isPurchasable?: boolean
}

export default function ProductList({ products, isPurchasable }: Props) {
  const { update } = useSession()
  const handlePurchase = (product: Product) => {
    toast.promise(
      async () => {
        const data = await purchaseProduct(product.id)
        await update({ points: data.remainingPoints })
        return data
      },
      {
        pending: 'Purchasing product...',
        success: {
          render: ({ data }) => data.message
        },
        error: {
          render: ({ data: error }) =>
            error instanceof Error && <ToastError message={error.message} />
        }
      }
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-3">
      {products.map((product, index) => (
        <ProductListItem
          style={{
            animationDelay: `${index * 120}ms`
          }}
          className="fade-in-up"
          key={product.id}
          product={product}
          isPurchasable={isPurchasable}
          onPurchase={handlePurchase}
        />
      ))}
    </div>
  )
}
