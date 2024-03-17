'use server'

import { revalidatePath } from 'next/cache'

export const revalidateOrder = (orderId: string) => {
  console.log('Revalidating order', orderId)
  revalidatePath('/', 'layout')
  revalidatePath(`/orders/${orderId}`)
}
