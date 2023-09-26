import React, { useEffect } from "react";
import Layout from "../components/layout";
import Header from "@/components/header";
import { AppProps } from "next/app";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import Moralis from "moralis";

const chains = [arbitrum, mainnet, polygon];
const projectId = "6b34ee74705d197441628f5eebf2e95b";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    });
  }, []); // Notez les crochets vides pour garantir un seul appel

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Layout>
          <Header />
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
