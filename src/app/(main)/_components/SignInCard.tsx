import { Card, CardHeader, Divider, CardBody } from '@nextui-org/react'
import SignInWithGoogleBtn from './SignInWithGoogleBtn'

export default function SignInCard() {
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Hello, Guest</p>
          <p className="text-small text-default-500">
            Please sign-in before purchase
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <SignInWithGoogleBtn />
      </CardBody>
    </Card>
  )
}
