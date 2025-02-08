"use client";

import type { ThemeProviderProps } from "next-themes";
import '@rainbow-me/rainbowkit/styles.css';
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';

const xrpl_evm_sidechain_devnet = {
  id: 1440002,
  name: 'XRPL EVM Sidechain Devnet',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
  iconBackground: '#fff',
  nativeCurrency: { name: 'XRP', symbol: 'XRP', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-evm-sidechain.xrpl.org'] },
  },
  blockExplorers: {
    default: { name: 'xrpl-evm-explorer-devnet', url: 'https://evm-sidechain.xrpl.org' },
  }
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [xrpl_evm_sidechain_devnet],
});

const queryClient = new QueryClient();
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        {/* <Component {...pageProps} /> */}
         <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
   );
}
