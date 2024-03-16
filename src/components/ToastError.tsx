'use client'

import React from 'react'

type Props = {
  message: any
}

export default function ToastError({ message }: Props) {
  return <div className="text-red-500">{message}</div>
}
