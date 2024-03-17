'use client'

import {
  Card,
  CardBody,
  Divider,
  CardFooter,
  Button,
  Image,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Chip
} from '@nextui-org/react'
import { Product } from '@prisma/client'
import Coin from '@/src/assets/svgs/coin.svg'
import { currencyUtil } from '@/src/uilts/currency'

type Props = {
  style?: React.CSSProperties
  className?: string
  product: Product
  isPurchasable?: boolean
  onPurchase: (product: Product) => void
}

export default function ProductListItem({
  style,
  className,
  product,
  isPurchasable,
  onPurchase
}: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const handlePurchase = () => {
    onPurchase(product)
    onClose()
  }

  return (
    <>
      <Card shadow="sm" key={product.id} style={style} className={className}>
        <CardBody className="overflow-visible p-0">
          <Image
            isZoomed
            shadow="sm"
            radius="lg"
            width={460}
            height={215}
            alt={product.name}
            className="w-full object-cover"
            src={product.image}
          />
        </CardBody>
        <CardBody className="text-small">
          <h4 className="text-large font-bold">{product.name}</h4>
        </CardBody>
        <Divider />
        <CardFooter className="justify-between">
          <Chip
            color="warning"
            variant="flat"
            startContent={<Coin />}
            size="lg"
          >
            {currencyUtil.format(product.price)}
          </Chip>
          {isPurchasable && (
            <Button color="primary" variant="flat" onPress={onOpen}>
              Purchase
            </Button>
          )}
        </CardFooter>
      </Card>
      {isPurchasable && (
        <Modal
          backdrop="opaque"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          classNames={{
            backdrop:
              'bg-gradient-to-t from-zinc-900/50 to-transparent backdrop-opacity-20'
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Are you sure?
                </ModalHeader>
                <ModalBody>
                  <p>
                    You are about to purchase <strong>{product.name}</strong>{' '}
                    for{' '}
                    <strong>{currencyUtil.format(product.price)} Points</strong>
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="success"
                    variant="flat"
                    onPress={handlePurchase}
                  >
                    Confirm
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
