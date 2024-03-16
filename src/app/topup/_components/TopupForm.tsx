'use client'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Input
} from '@nextui-org/react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createOrder } from '../actions'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import ToastError from '@/src/components/ToastError'
import Coin from '@/src/assets/svgs/coin.svg'

const validationSchema = yup.object().shape({
  points: yup
    .number()
    .required('Please enter the points you want to topup')
    .positive('Please enter a positive number')
    .integer('Please enter a whole number')
})

type Props = {
  currentPoints: number
}

export default function TopupForm({ currentPoints }: Props) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit = handleSubmit(async (data) => {
    const amount = data.points * 100
    const currency = 'thb'

    OmiseCard.configure({
      publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY!
    })

    const nounce = await new Promise<string>((resolve) => {
      OmiseCard.open({
        amount,
        currency,
        onCreateTokenSuccess: resolve
      })
    })

    if (!nounce) return

    toast.promise(
      createOrder({
        nounce,
        currency,
        amount
      }),
      {
        pending: 'Creating order...',
        success: {
          render: ({ data }) => data.message
        },
        error: {
          render: ({ data: error }) =>
            error instanceof Error && <ToastError message={error.message} />
        }
      }
    )

    router.replace('/')
  })

  return (
    <form
      className="container mx-auto flex flex-col justify-center items-center h-dvh gap-5 py-10 max-w-md px-5"
      onSubmit={onSubmit}
    >
      <Card className="w-full">
        <CardHeader className="flex items-center justify-between">
          <h1>Points Topup</h1>
          <Chip color="warning" variant="flat" startContent={<Coin />}>
            {currentPoints.toLocaleString('th-TH')}
          </Chip>
        </CardHeader>
        <Divider />
        <CardBody>
          <Input
            {...register('points')}
            type="number"
            label="Points to topup"
            isRequired
            isReadOnly={isSubmitting}
          />
        </CardBody>
        <Divider />
        <CardFooter>
          <Button
            className="w-full"
            variant="flat"
            color={isSubmitSuccessful ? 'success' : 'primary'}
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting || isSubmitSuccessful}
            disableAnimation={false}
          >
            {isSubmitSuccessful ? 'Success' : 'Pay Now'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
