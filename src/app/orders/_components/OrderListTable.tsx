'use client'

import OrderStatusChip from '@/src/components/OrderStatusChip'
import PointsChip from '@/src/components/PointsChip'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination
} from '@nextui-org/react'
import { Order } from '@prisma/client'
import moment from 'moment'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

type Props = {
  orders: Order[]
  page: number
  perPage: number
}

export default function OrderListTable({ orders }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const onPageChange = useCallback(
    (page: number) => {
      const query = createQueryString('page', page.toString())
      router.push(`${pathname}?${query}`)
    },
    [createQueryString, pathname, router]
  )

  return (
    <Table
      aria-label="Order history table"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            variant="flat"
            color="primary"
            isCompact
            showControls
            showShadow
            page={parseInt(searchParams.get('page') || '1')}
            total={2}
            onChange={onPageChange}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn>Ordered At</TableColumn>
        <TableColumn>Id</TableColumn>
        <TableColumn>Points</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody
        items={orders}
        emptyContent="You don't have any orders yet. Go to the shop and topup your points!"
      >
        {(order) => (
          <TableRow key={order.id}>
            <TableCell width="20%">
              {moment(order.createdAt).format('YYYY-MM-DD HH:mm A')}
            </TableCell>
            <TableCell>
              <small>{order.id}</small>
            </TableCell>
            <TableCell>{<PointsChip points={order.points} />}</TableCell>
            <TableCell>
              <OrderStatusChip status={order.status} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
