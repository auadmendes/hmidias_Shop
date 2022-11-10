import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Image from 'next/image'

import logoImage from '../assets/Logo.svg'
import hLogoImage from '../assets/hLogo.svg'
import Link from 'next/link'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='flex flex-col items-start justify-center min-h-screen'>
      <header className='pt-8 pb-2 w-screen max-w-screen-lg mx-auto mb-10'>
        <Link href={'/'}>
          <Image src={hLogoImage} alt="three triangles overlapping each other" />
        </Link>
      </header>
      <Component {...pageProps} />
    </div>
  )
}
