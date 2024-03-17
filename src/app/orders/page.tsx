import { auth } from '@/src/libs/auth'
import { Card, CardHeader } from '@nextui-org/react'
import { redirect } from 'next/navigation'
import OrderListTable from './_components/OrderListTable'
import { getPaginatedOrdersByUserId } from './actions'

type Props = {
  searchParams: {
    page: number
    perPage: number
  }
}

export default async function Orders({ searchParams }: Props) {
  const session = await auth()

  if (!session) return redirect('/')

  const page = searchParams.page || 1
  const perPage = searchParams.perPage || 10

  const orders = await getPaginatedOrdersByUserId({
    userId: session.user.id,
    page,
    perPage
  })

  return (
    <main className="container flex flex-col mx-auto h-dvh space-y-4 py-4">
      <Card>
        <CardHeader>
          <h1 className="text-large">Order history</h1>
        </CardHeader>
      </Card>
      <OrderListTable orders={orders.data} page={page} perPage={perPage} />
    </main>
  )
}
