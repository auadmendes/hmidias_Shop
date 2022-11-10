import { GetStaticProps } from "next";
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import Head from "next/head";

import { stripe } from "../lib/stripe";
import Stripe from "stripe";

import Image from "next/image";
import Link from "next/link";

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    }
  })

  return (
    <>
      <Head>
        <title>Home | HMidias Shop</title>
      </Head>

      <main ref={sliderRef} className="flex w-full max-w-shop ml-auto min-h-[600px] keen-slider"
      >

        {products.map(product => {
          return (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              prefetch={false}
              className="keen-slider__slide bg-gradient-to-br from-gradient-first 
          to-gradient-second rounded-lg relative flex items-center justify-center"
            >
              <Image src={product.imageUrl} alt="t-shirt" width={520} height={480} className="object-cover" />

              <footer
                className="group absolute bottom-0 left-0 right-0 
              rounded-sm flex items-end justify-between bg-price p-5
              opacity-50 hover:opacity-100 duration-100 items-center"
              >
                <strong className="text-lg">{product.name} </strong>
                <span className="text-xl bold text-green-300">{product.price}</span>
              </footer>
            </Link>
          )
        })}



      </main>
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   //await new Promise(response => setTimeout(response, 10000))
//   const response = await stripe.products.list({
//     expand: ['data.default_price']
//   })

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  })

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: "currency",
        currency: "BRL",
      }).format(price.unit_amount / 100),

    }
  })

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 24,
  }
}