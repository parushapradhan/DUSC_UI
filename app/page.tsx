
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import XRPLBridge from "@/components/XRPTransfer";
export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}> Decentralized Untraceable &nbsp;</span>
        <span className={title({ color: "violet" })}>Stable Coin&nbsp;</span>
        <br />
      </div>

      <ConnectButton/>
      <div className="mt-2">
      <XRPLBridge/>
      </div>
    </section>
  );
}
