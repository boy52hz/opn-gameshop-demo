import { omise } from '@/src/libs/omise'
import { prisma } from '@/src/libs/prisma-client'
import { redirect } from 'next/navigation'
import OrderComplete from './_components/OrderComplete'
import { auth } from '@/src/libs/auth'
import OrderPending from './_components/OrderPending'
import OrderFailed from './_components/OrderFailed'
import { revalidatePath } from 'next/cache'

type Props = {
  params: {
    id: string
  }
}

export default async function OrderDetail({ params }: Props) {
  const session = await auth()

  if (!session) return redirect('/')

  const order = await prisma.order.findUnique({
    where: { id: params.id }
  })

  if (!order || !order.omiseChargeId || session.user.id !== order.userId)
    return redirect('/')

  const charge = await omise.charges.retrieve(order.omiseChargeId)
  const status = (charge as any).status as IChargeStatus

  if (status === 'successful') {
    revalidatePath('/', 'layout')
  }

  return (
    <main className="container mx-auto flex flex-col justify-center items-center h-dvh gap-5 py-10 max-w-md px-5">
      {status === 'pending' && <OrderPending order={order} charge={charge} />}
      {status === 'successful' && (
        <OrderComplete order={order} charge={charge} />
      )}
      {status === 'failed' && <OrderFailed order={order} charge={charge} />}
    </main>
  )
}
