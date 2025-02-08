"use client";
import {Button, Card, Input} from "@heroui/react";
import {useState, useCallback, useEffect} from "react";
import {BackgroundGradient} from "@/components/ui/background-gradient";
import {Identity, generateProof, Group} from "@semaphore-protocol/core";
import {abi} from "@/public/abi.js";
import Web3 from "web3";
import {useAccount, useBalance} from "wagmi";
import {BrowserProvider, ethers, JsonRpcSigner, JsonRpcProvider} from "ethers";
import {SemaphoreEthers} from "@semaphore-protocol/data";
import {error} from "console";

export default function XRPLBridge() {
    const {address, isConnected, chain} = useAccount();
    const [depositAmount, setDepositAmount] = useState("");
    const [depositPassword, setDepositPassword] = useState("");
    const [mintPassword, setMintPassword] = useState("");
    const [error, setError] = useState("");
    const CONTRACT_ADDRESS = "0x36C126f4D8c30a77a29E6Ff4416c5AdD1b622dE0";
    const RPC = process.env.RPC;
    const SEMAPHORE_CONTRACT = process.env.SEMAPHORE_CONTRACT;
    const [balance, setBalance] = useState<number | null>(null)
    const identity = new Identity(depositPassword);
    let users = [];

    async function handleTransfer() {
        const identity = new Identity(depositPassword);

        if (typeof window.ethereum !== "undefined") {
            await window.ethereum.request({method: "eth_requestAccounts"});

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            console.log(CONTRACT_ADDRESS);
            console.log(abi.abi);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
            const result = await contract.depositCollateral({
                value: ethers.parseEther("1.0"),
            });
            //refresh users
        }
    }

    async function mint() {
        if (mintPassword != depositPassword) {
            setError("Contract Revert: Semaphore invalid proof");
            return;
        } else {
            setError("");
        }

        const semaphore = new SemaphoreEthers(RPC, {
            address: SEMAPHORE_CONTRACT,
        });

        const members = await semaphore.getGroupMembers("1");
        console.log(members);

        users = members.map((member) => members.toString());
        console.log(users);
        const group = new Group(members);

        console.log("grouo : ", group);
        console.log("identity", identity);

        // const {points, merkleTreeDepth, merkleTreeRoot, nullifier} = await generateProof(identity, group, "0", "1");

        // console.log(points, merkleTreeDepth, merkleTreeRoot, nullifier)
        const proofs = await semaphore.getGroupValidatedProofs("1");
        // console.log("proofs", proofs);

        if (typeof window.ethereum !== "undefined") {
            await window.ethereum.request({method: "eth_requestAccounts"});

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);

            const result = await contract.mint();
            console.log(result);
            //refresh users
        }
    }

    const refreshFeedback = useCallback(async (): Promise<void> => {
        const semaphore = new SemaphoreEthers(RPC, {
            address: SEMAPHORE_CONTRACT,
        });

        const proofs = await semaphore.getGroupValidatedProofs("1");
        console.log("proofs", proofs);
    }, []);

    

   async function showBalance() {
        const semaphore = new SemaphoreEthers(RPC, {
            address: SEMAPHORE_CONTRACT,
        });

        const members = await semaphore.getGroupMembers("1");
        console.log(members);

        users = members.map((member) => members.toString());
        console.log(users);
        const group = new Group(members);

        console.log("group : ", group);
        console.log("identity", identity);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
        const test = Number(await contract.balanceOf(address));
        console.log(test/(10**18));
    }

    const fetchBalance = useCallback(async () => {
      if (!address || !window.ethereum) return;

      try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
          const balanceRaw = await contract.balanceOf(address);
          const formattedBalance = Number(balanceRaw) / 10 ** 18;

          setBalance(formattedBalance);
          console.log("Updated Balance:", formattedBalance);
      } catch (err) {
          console.error("Error fetching balance:", err);
          setBalance(null);
      }
  }, [address]);
    useEffect(() => {
      fetchBalance();
  }, [fetchBalance]); // Updates balance when address changes


    return (
        <div className="flex flex-col items-center min-h-screen text-white p-6">
            <h1 className="text-xl font-bold mb-2"> Convert XRP to DUSC </h1>

            <BackgroundGradient className="rounded-[22px] max-w-xl p-4 sm:p-10 bg-zinc-900 dark:bg-white">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Card className="min-h-[200px] relative p-6 w-full sm:w-1/2 max-w-lg bg-transparent border-0 flex flex-col items-center">
                        <p className="mb-2">Deposit</p>
                        <Input
                            type="number"
                            placeholder="Enter amount"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="w-full p-2 min-w-[200px] bg-transparent text-white"
                        />
                        <Input
                            type="password"
                            placeholder="Enter password"
                            value={depositPassword}
                            onChange={(e) => setDepositPassword(e.target.value)}
                        ></Input>
                        <Button className="mt-6 w-full min-w-[200px] bg-purple-600 text-white" onPress={handleTransfer}>
                            Transfer
                        </Button>
                    </Card>

                    <div className="flex items-center justify-center text-2xl text-gray-400">→</div>

                    <Card className="min-h-[200px] relative p-6 w-full sm:w-1/2 max-w-lg bg-transparent border-0 flex flex-col items-center">
                        <p className="mb-2">Claim</p>

                        <div className="mb-1 text-sm font-semibold">
                          Balance: {balance !== null ? `${balance} DUSC` : "Loading..."}
                        </div>

                        <Input
                            type="password"
                            placeholder="Enter password"
                            value={mintPassword}
                            className="min-w-[200px]"
                            onChange={(e) => setMintPassword(e.target.value)}
                        ></Input>

                       
                        <Button className="mt-6 w-full bg-purple-600 text-white" onPress={mint}>
                            Mint
                        </Button>
                    </Card>
                </div>
            </BackgroundGradient>
        </div>
    );
}
