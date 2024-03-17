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
import Coin from '@/src/assets/svgs/coin.svg'
import { MAX_TOPUP_AMOUNT, MIN_TOPUP_AMOUNT } from '@/src/constants/topup'
import { toast } from 'react-toastify'
import { currencyUtil } from '@/src/uilts/currency'

const validationSchema = yup
  .object()
  .shape({
    points: yup
      .number()
      .typeError('Please enter a number')
      .required('Please enter the points you want to topup')
      .positive('Please enter a positive number')
      .integer('Please enter a whole number')
      .min(MIN_TOPUP_AMOUNT, `Minimum topup is ${MIN_TOPUP_AMOUNT} points`)
      .max(MAX_TOPUP_AMOUNT, `Maximum topup is ${MAX_TOPUP_AMOUNT} points`)
  })
  .required()

type Props = {
  currentPoints: number
}

export default function TopupForm({ currentPoints }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
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
        //@ts-ignore
        otherPaymentMethods: ['truemoney', 'promptpay'],
        onCreateTokenSuccess: resolve,
        onFormClosed: reset
      })
    })

    const res = await createOrder({
      amount,
      currency,
      nounce
    })

    if (res && res.success) {
      toast.error(res.message)
    }
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
            {currencyUtil.format(currentPoints)}
          </Chip>
        </CardHeader>
        <Divider />
        <CardBody>
          <Input
            {...register('points')}
            label="Points to topup"
            disabled={isSubmitting}
            errorMessage={errors.points?.message}
            isInvalid={!!errors.points}
            color={errors.points && 'danger'}
            isRequired
            description={`You can topup between ${MIN_TOPUP_AMOUNT} and ${MAX_TOPUP_AMOUNT} points.`}
          />
        </CardBody>
        <Divider />
        <CardFooter>
          <Button
            className="w-full"
            variant="flat"
            color="primary"
            type="submit"
            isLoading={isSubmitting}
            isDisabled={isSubmitting || isSubmitSuccessful}
          >
            {isSubmitting ? 'Processing...' : 'Pay now'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
