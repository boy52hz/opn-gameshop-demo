import { redirect } from 'next/navigation'
import TopupForm from './_components/TopupForm'
import { auth } from '@/src/libs/auth'

export default async function Topup() {
  const session = await auth()

  if (!session) {
    return redirect('/')
  }

  return <TopupForm currentPoints={session?.user.points || 0} />
}
