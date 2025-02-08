"use client";
import {Button, Card, Input} from "@heroui/react";
import {useState, useCallback} from "react";
import {BackgroundGradient} from "@/components/ui/background-gradient";
import {Identity, generateProof, Group} from "@semaphore-protocol/core";
import {abi} from "@/public/abi.js";
import Web3 from "web3";
import {useAccount, useBalance} from "wagmi";
import {BrowserProvider, ethers, JsonRpcSigner} from "ethers";
import {SemaphoreEthers} from "@semaphore-protocol/data";

export default function XRPLBridge() {
    const {address, isConnected, chain} = useAccount();
    const [depositAmount, setDepositAmount] = useState("");
    const [depositPassword, setDepositPassword] = useState("test");
    const [mintPassword, setMintPassword] = useState("");
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const RPC = process.env.RPC;
    const SEMAPHORE_CONTRACT = process.env.SEMAPHORE_CONTRACT;
    const identity = new Identity(depositPassword);
    let users=[]


    async function handleTransfer() {
        const identity = new Identity(depositPassword);

        if (typeof window.ethereum !== "undefined") {
            await window.ethereum.request({method: "eth_requestAccounts"});

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
            const result = await contract.depositCollateral(identity.commitment.toString(), {
                value: ethers.parseEther("1.0"),
            });
            //refresh users
        }
    }

    async function mint() {
        const semaphore = new SemaphoreEthers(RPC, {
            address: SEMAPHORE_CONTRACT,
        });

        const members = await semaphore.getGroupMembers("1");
          console.log(members)

        

        users= (members.map((member)=>members.toString()))
        console.log(users)
        const group = new Group(members);
        console.log("grouo : ", group)
        console.log("identity", identity
        )

        // const {points, merkleTreeDepth, merkleTreeRoot, nullifier} = await generateProof(
        //     identity,
        //     group,
        //     '0',
        //     '1'
        // );


        // console.log(points, merkleTreeDepth, merkleTreeRoot, nullifier)
        const proofs = await semaphore.getGroupValidatedProofs("1");
        console.log('proofs',proofs);

      //   if (typeof window.ethereum !== "undefined") {
      //     await window.ethereum.request({method: "eth_requestAccounts"});

      //     const provider = new ethers.BrowserProvider(window.ethereum);
      //     const signer = await provider.getSigner();

      //     const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
      //     const params = [merkleTreeDepth, merkleTreeRoot, nullifier, points]
      //     const result = await contract.mint(params);
      //     console.log(result)
      //     //refresh users
      // }
    }

    const refreshFeedback = useCallback(async (): Promise<void> => {
        const semaphore = new SemaphoreEthers(RPC, {
            address: SEMAPHORE_CONTRACT,
        });

        const proofs = await semaphore.getGroupValidatedProofs("1");
        console.log('proofs',proofs);
    }, []);

    async function claim(){
      const identity = new Identity(depositPassword)
           const { points, merkleTreeDepth, merkleTreeRoot, nullifier } = await generateProof(
            identity,
            group,
            '1,0', //message
            '0x1f5e0FCdDe7afCF3bB08df6b9676DB022bC3358f' //group address
        )
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
                            onChange={(e) => setDepositPassword(e.target.value)}
                        ></Input>
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
                            onChange={(e) => setMintPassword(e.target.value)}
                        ></Input>
                    </Card>
                </div>

                <Button className="mt-6 w-full bg-purple-600 text-white" onPress={handleTransfer}>
                    Transfer
                </Button>
                <Button className="mt-6 w-full bg-purple-600 text-white" onPress={mint}>
                    Mint
                </Button>
            </BackgroundGradient>
        </div>
    );
}
