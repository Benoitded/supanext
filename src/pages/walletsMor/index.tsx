import Image from "next/image";
import styles from "./page.module.css";
import supabase from "@/supabase";
import { log } from "console";
import { useEffect, useRef, useState } from "react";
import jwt from "jsonwebtoken";

import axios from "axios";
import { ethers } from "ethers";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSignMessage,
} from "wagmi";
import { recoverMessageAddress } from "viem";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { avalanche, bsc, mainnet } from "wagmi/chains";

import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { BrowserProvider } from "ethers";
import { SiweMessage } from "siwe";
import { createClient } from "@supabase/supabase-js";
import { verifyMessage as verifyMessageM } from "@/pages/api/auth";

import Moralis from "moralis";

const STATEMENT = "Please sign this message to confirm your identity.";
const EXPIRATION_TIME = 900000;
const TIMEOUT = 15;

const _supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

Moralis.start({
  apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
});

export const connectToMetamask = async () => {
  console.log(ethers);
  console.log(ethers.providers);
  const provider = new ethers.providers.Web3Provider(ethereum);

  const [accounts, chainId] = await Promise.all([
    provider.send("eth_requestAccounts", []),
    provider.send("eth_chainId", []),
  ]);

  const signer = provider.getSigner();
  return { signer, chain: chainId, account: accounts[0] };
};

export async function requestMessage({
  address,
  networkType,
}: {
  address: string;
  chain: string;
  networkType: "evm";
}) {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const now = new Date();
  const expirationTime = new Date(now.getTime() + EXPIRATION_TIME);
  let chain = "1";
  console.log(address);

  const result = await Moralis.Auth.requestMessage({
    address,
    chain,
    networkType,
    domain: "supabase.co",
    statement: STATEMENT,
    uri: url.toString(),
    notBefore: now.toISOString(),
    expirationTime: expirationTime.toISOString(),
    timeout: TIMEOUT,
  });

  const { message } = result.toJSON();
  console.log(result);
  console.log(message);
  return { message };
}

export async function verifyMessage({
  networkType,
  signature,
  message,
}: VerifyMessage) {
  console.log("---verify---");
  console.log(networkType);
  console.log(signature);
  console.log(message);
  const result = await Moralis.Auth.verify({
    networkType,
    signature,
    message,
  });
  console.log("result");
  console.log(result);

  const authData = result.toJSON();
  console.log("authData");
  console.log(authData);

  let { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("moralis_provider_id", authData.profileId)
    .single();

  if (!user) {
    const response = await supabase
      .from("users")
      .insert({ moralis_provider_id: authData.profileId, metadata: authData })
      .single();
    user = response.data;
    console.log("response");
    console.log(response);
  }

  const token = jwt.sign(
    {
      ...user,
      aud: "authenticated",
      role: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    process.env.NEXT_PUBLIC_JWT_SECRET
  );

  return { user, token };
}

export default function Login() {
  const { address, connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [recoveredAddress, setRecoveredAddress] = useState("");
  const [resMsg, setResMsg] = useState("");
  const {
    data,
    error: errorM,
    isLoading: isLoadingM,
    signMessage,
    signMessageAsync,
    variables,
  } = useSignMessage();
  const [state, setState] = useState<{
    loading?: boolean;
    nonce?: string;
  }>({});

  useEffect(() => {
    (async () => {
      if (variables?.message && data) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: data,
        });
        setRecoveredAddress(recoveredAddress);
      }
    })();
  }, [data, variables?.message, recoveredAddress]);

  async function handleSIWE() {
    console.log("SIWE");
    console.log(mainnet);
    let account = [address];

    // const { signer, chain, account } = await connectToMetamask();

    // if (!account) {
    //   throw new Error("No account found");
    // }
    // if (!chain) {
    //   throw new Error("No chain found");
    // }

    const { message } = await requestMessage({ address });
    console.log(message);
    const signature = await signMessageAsync({ message });
    console.log(signature);
    console.log(data);

    const { user } = await verifyMessage({
      message,
      signature,
      networkType: "evm",
    });
    console.log(user);

    // _supabaseAuthenticated = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_ANON_KEY, {
    //   global: {
    //     headers: {
    //       Authorization: `Bearer ${user.token}`,
    //     },
    //   },
    // });

    // renderUser(user);
    // renderError();
  }

  return (
    <div>
      <div>Hello login</div>
      <div>Mail</div>
      <input type="mail" name="" id="" />
      <div>Password</div>
      <input type="password" name="" id="" />
      <button
        onClick={(event) => {
          event.preventDefault();
          const message =
            "ClareFi would like you to connect with your wallet \n\n" +
            address +
            ". \n\n\n\nPlease sign in to comment, tag, add to favorite, ...";
          signMessage({ message });
        }}
      >
        Send msg addr
      </button>
      {data && <div>{data}</div>}
      <button onClick={handleSIWE}>Auth SIWE</button>
    </div>
  );
}
