'use client'

import React from 'react'

type Props = {
  message: string
}

export default function ToastError({ message }: Props) {
  return <div className="text-red-500">{message}</div>
}
