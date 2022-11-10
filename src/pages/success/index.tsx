import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Stripe from 'stripe';
import image1 from '../../assets/camisetas/1.png';
import { stripe } from '../../lib/stripe';

interface SuccessProps {
  customerName: string;
  product: {
    name: string;
    imageUrl: string;
  }
}

export default function Success({ customerName, product }: SuccessProps) {
  return (

    <>

      <Head>
        <title>Compra efetuada | HMidias Shop</title>
        <meta name='robots' content='noindex' />
      </Head>

      <main className=" flex flex-col items-center justify-center ml-auto mr-auto h-[656px] gap-10">
        <h1 className='text-2xl font-sans font-bold text-gray-100'>
          Congratulations
        </h1>

        <div className='bg-gradient-to-br from-gradient-first 
          to-gradient-second w-full rounded-lg p-1 flex items-center 
          justify-center object-cover box-border max-w-[130px] h-[145px]
          transition-all hover:max-w-[190px] hover:h-[205px]'
        >
          <Image src={product.imageUrl} width={520} height={480} alt='' />
        </div>
        <p className='text-xl text-gray-300 max-w-[560px] text-center'>
          Wow, <strong>{customerName}! </strong> Your <strong> {product.name} </strong>is on the way to delivery.
        </p>

        <Link href={'/'} className='mt-10 text-hmidiasColor text-lg hover:text-hmidiasColorHover'>
          Back to Home
        </Link>

      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = session.customer_details.name
  const product = session.line_items.data[0].price.product as Stripe.Product
  //console.log(session.line_items.data)

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      }
    }
  }
}