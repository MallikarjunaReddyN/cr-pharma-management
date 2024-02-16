import { Button } from '@nextui-org/react'
import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <section>
      <div className='flex flex-col md:flex-row items-center justify-center gap-3 min-h-screen'>
        <div className='flex-1 flex flex-col gap-6 justify-center md:pl-[100px]'>
          <h1 className="md:text-5xl text-2xl md:leading-normal leading-10 text-white font-bold">
            <span className="text-[#00a69c] md:text-5xl text-2xl">
              Take Care Of  Customer Health <br /> And Take Care Of Your Health &nbsp;<span><ion-icon name="pulse-outline"></ion-icon></span>
              <br />
            </span>
          </h1>
          <h4 className="md:text-xl text-lg md:leading-normal leading-5  font-bold text-gray-500">
            Medicines may cure, but only pharmacists can care.
          </h4>
          <Image src="/arrangingtablets.webp" alt="" width={700} height={700} className="" />
        </div>

        <div className='flex-1 flex flex-col gap-6 justify-center'>
          <Image src="/pharmacy.jpeg" alt="" width={700} height={700} className="" />
          <h1 className="md:text-5xl text-2xl md:leading-normal leading-10 text-white font-bold">
            <span className="text-[#00a69c] md:text-5xl text-2xl">
              We Care About Customer Health <br /> And Wellbeing
            </span>
          </h1>
          <h4 className="md:text-xl text-lg md:leading-normal leading-5 font-bold text-gray-500 mb-10">
            The more you care, The Strong customers can be.
          </h4>
        </div>
      </div>
    </section>
  )
}
