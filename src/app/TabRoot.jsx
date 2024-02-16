"use client"

import { Tabs, Tab } from "@nextui-org/react";
import { CartIcon } from "../components/logos/CartIcon";
import { OrderIcon } from "../components/logos/OrderIcon";
import { RupeeIcon } from "../components/logos/RupeeIcon";
import Stocks from "./stocks/Stocks";
import Borrows from "./borrows/Borrows";
import Orders from "./orders/Orders";


export default function TabRoot() {

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options"
        color="primary" size='sm'
        fullWidth='true' radius="none"
        defaultSelectedKey={sessionStorage.getItem("key") ? sessionStorage.getItem("key")  : "stocks"}
        onSelectionChange={(key) => sessionStorage.setItem("key", key)}
        classNames={{
          cursor: "w-full rounded-lg bg-[#00a69c]",
        }}>
        <Tab
          key="stocks"
          title={
            <div className="flex items-center space-x-2">
              <CartIcon />
              <span>Stocks</span>
            </div>
          }
        > <Stocks />
        </Tab>
        <Tab
          key="orders"
          title={
            <div className="flex items-center space-x-2">
              <OrderIcon />
              <span>Orders</span>
            </div>
          }
        >
          <Orders />
        </Tab>
        <Tab
          key="borrows"
          title={
            <div className="flex items-center space-x-2">
              <RupeeIcon />
              <span>Borrows</span>
            </div>
          }
        >
          <Borrows />
        </Tab>
      </Tabs>
    </div>
  );
}
