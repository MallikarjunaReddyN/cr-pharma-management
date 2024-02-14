"use client"

import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";
import TabRoot from "./TabRoot";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      {session ? <TabRoot /> : <div className='absolute top-[50%] left-[50%]'><Spinner label="Loading..." /></div>}
    </div>
  )
}
