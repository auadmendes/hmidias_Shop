import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { stripe } from "../../lib/stripe";
import Stripe from "stripe";

import image1 from '../../assets/camisetas/1.png'
import axios from 'axios';
import { useState } from 'react';
import Head from 'next/head';

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  }
}

export default function Product({ product }: ProductProps) {
  // const router = useRouter() // to redirect to an internal page
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)
  const { isFallback } = useRouter()

  if (isFallback) {
    return <h1>Loading</h1>
  }

  async function handleBuyProduct() {
    setIsCreatingCheckoutSession(true)

    try {
      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data;

      // router.push('/success') // to redirect to an internal page

      //redirecting user to an external page / application
      window.location.href = checkoutUrl

    } catch (error) {
      setIsCreatingCheckoutSession(false)
      alert('Failed buying')
    }
  }

  return (
    <>

      <Head>
        <title>{product.name} | HMidias Shop</title>
      </Head>

      <main className='grid grid-cols-2 max-w-6xl items-stretch ml-auto mr-auto gap-16'>

        <div className='bg-gradient-to-br from-gradient-first 
          to-gradient-second w-full rounded-lg p-1 flex items-center justify-center 
          object-cover box-border h-[656px] max-w[576px]'>
          <Image src={product.imageUrl} width={520} height={480} alt='' />
        </div>

        <div className='flex flex-col'>
          <h1 className='text-2xl text-gray-300'>{product.name}</h1>
          <span className='mt-4 block text-2xl text-green-300'>{product.price}</span>
          <p className='mt-10 text-md leading-6 text-gray-300'>{product.description}</p>
          <button
            onClick={handleBuyProduct}
            disabled={isCreatingCheckoutSession}
            className='mt-auto bg-hmidiasColor border-0 text-white p-5 
          disabled:cursor-not-allowed disabled:bg-gray-600 active:bg-yellow-200
          rounded-md cursor-pointer font-bold transition-all hover:bg-hmidiasColorHover hover:text-gray-700'
          >
            Buy now
          </button>
        </div>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'prod_MlCVUaIbZ5uGi8' } }
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: "currency",
          currency: "BRL",
        }).format(price.unit_amount / 100),
        description: product.description,
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 2
  }
}