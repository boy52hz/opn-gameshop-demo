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
    <main className="relative container mx-auto min-h-dvh space-y-4 p-5">
      <Card className="hidden lg:block">
        <CardHeader>
          <h1 className="text-large">OPN Demo - Game shop</h1>
        </CardHeader>
      </Card>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex flex-[2] flex-col gap-4 sticky top-0 z-10 lg:static">
          {session?.user ? <ProfileCard /> : <SignInCard />}
          <TopupHistory />
        </div>
        <div className="flex-[5]">{children}</div>
      </div>
    </main>
  )
}
