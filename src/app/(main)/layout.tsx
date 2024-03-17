import TopupHistory from './_components/TopupHistory'
import ProfileCard from './_components/ProfileCard'
import { Card, CardHeader } from '@nextui-org/react'
import { auth } from '@/src/libs/auth'
import SignInCard from './_components/SignInCard'

type Props = {
  children: React.ReactNode
}

export default async function MainLayout({ children }: Props) {
  const session = await auth()
  return (
    <main className="container mx-auto h-dvh space-y-4 py-4">
      <Card>
        <CardHeader>
          <h1 className="text-large">OPN Demo - Game shop</h1>
        </CardHeader>
      </Card>
      <div className="flex gap-10">
        <div className="flex-[2] flex flex-col gap-4">
          {session?.user ? <ProfileCard /> : <SignInCard />}
          <TopupHistory />
        </div>
        <div className="flex-[5]">{children}</div>
      </div>
    </main>
  )
}
