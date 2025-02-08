'use client'
import { Button, Card, Input } from "@heroui/react";
import { useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";


export default function XRPLBridge() {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositPassword, setDepositPassword] = useState("");
  const [mintPassword, setMintPassword] = useState("");
 
  function handleTransfer(){
    //transfer call add here 
  }


  return (
    <div className="flex flex-col items-center min-h-screen text-white p-6">
      <h1 className="text-xl font-bold">Transfer assets across XRPL chains.</h1>

      <BackgroundGradient className="rounded-[22px] max-w-xl p-4 sm:p-10 bg-zinc-900">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Card className="relative p-6 w-full sm:w-1/2 max-w-lg bg-transparent border-0 flex flex-col items-center">
            <p className="mb-2">Deposit</p>
            <Input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-2  bg-transparent text-white"
            />
            <Input
              type="password"
              placeholder="Enter password"
              value={depositPassword}
              onChange={(e) => setDepositPassword(e.target.value)}></Input>
              

          </Card>
          
          <div className="flex items-center justify-center text-2xl text-gray-400">⇄</div>
          
          <Card className="relative p-6 w-full sm:w-1/2 max-w-lg bg-transparent border-0 flex flex-col items-center">
            <p className="mb-2">Claim</p>
            <Input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-2  bg-transparent text-white"
            />
            <Input
              type="password"
              placeholder="Enter password"
              value={mintPassword}
              onChange={(e) => setMintPassword(e.target.value)}></Input>
          </Card>
        </div>

        <Button className="mt-6 w-full bg-purple-600 text-white" onClick={handleTransfer}>Transfer</Button>
      </BackgroundGradient>
    </div>
  );
}
