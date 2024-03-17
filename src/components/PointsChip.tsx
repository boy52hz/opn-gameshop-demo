'use client'

import { Chip } from '@nextui-org/react'
import { currencyUtil } from '../uilts/currency'
import Coin from '@/src/assets/svgs/coin.svg'

type Props = {
  classNames?: {
    chip?: string
    icon?: string
  }
  points: number
}

export default function PointsChip({ points, classNames }: Props) {
  return (
    <Chip
      className={classNames?.chip}
      color="warning"
      variant="flat"
      startContent={<Coin className={classNames?.icon} />}
    >
      {currencyUtil.format(points)}
    </Chip>
  )
}
