import { Button } from '@nextui-org/react'
import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <div
      id="home"
      className="flex md:flex-row flex-col md:mt-[170px] gap-[100px]"
    >
      <div className="flex-1 flex h-full">
        <Image src="/home.jpeg" alt="" width={500} height={500} className="md:w-11/12 h-full object-cover" />
      </div>
      <div className="flex-1 md:mt-[85px]" >
        <div className="md:text-left text-center">
          <h1 className="md:text-5xl text-2xl md:leading-normal leading-10 text-white font-bold">
            <span className="text-[#00a69c] md:text-6xl text-4xl">
              Protect your health <br /> and take care of <br />your health &nbsp;<span><ion-icon name="pulse-outline"></ion-icon></span>
              <br />
            </span>
          </h1>
          <h4 className="md:text-xl text-lg md:leading-normal leading-5 mt-4 font-bold text-gray-500">
          Medicines may cure, but only pharmacists can care.
          </h4>
          <a href="https://maps.google.com/maps/place//data=!4m2!3m1!1s0x3bcb8d7c1f4e21eb:0x30af8f0ae7e5054a?entry=s&sa=X&ved=2ahUKEwiD9MH3t5KEAxUngFYBHT5tDf8Q4kB6BAgREAA&hl=en-GB" target="_blank"><Button className="btn-primary mt-8">Location</Button></a>
        </div>
      </div>
    </div>
  )
}
