import React from 'react'
import Head from 'next/head'
import LandingPage from '../components/LandingPage'

export default function Home() {
  return (
    <>
      <Head>
        <title>Sri Lanka Crisis Help</title>
        <meta name="description" content="Connect those in need with those who can help" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LandingPage />
    </>
  )
}
