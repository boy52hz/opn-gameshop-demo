'use client'

import { Product } from '@prisma/client'
import ProductListItem from './ProductListItem'
import { purchaseProduct } from '../actions'
import { toast } from 'react-toastify'
import ToastError from '@/src/components/ToastError'

type Props = {
  products: Product[]
  isPurchasable?: boolean
}

export default function ProductList({ products, isPurchasable }: Props) {
  const handlePurchase = (product: Product) => {
    toast.promise(
      async () => {
        const data = await purchaseProduct(product.id)
        if (!data.success) {
          throw new Error(data.message)
        }
        return data
      },
      {
        pending: 'Processing...',
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
