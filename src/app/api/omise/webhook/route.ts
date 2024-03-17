import { handleChargeComplete } from './_handlers/charge.handler'
import { Charges } from 'omise'

export const POST = async (req: Request) => {
  const { key, data } = await req.json()

  console.log('Webhook processed', key, data.id)

  switch (key) {
    case 'charge.complete':
      await handleChargeComplete(data as Charges.ICharge)
      break
  }

  console.log('Webhook has been processed')

  return Response.json(
    {
      success: true,
      message: 'Webhook has been processed'
    },
    {
      status: 200
    }
  )
}
