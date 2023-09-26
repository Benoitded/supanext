import Image from "next/image";
import styles from "./page.module.css";
import supabase from "@/supabase";
import { log } from "console";
import { useEffect, useRef, useState } from "react";

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
import { SiweMessage } from "siwe";
import { createClient } from "@supabase/supabase-js";

import Moralis from "moralis";

const STATEMENT = "Please sign this message to confirm your identity.";
const EXPIRATION_TIME = 900000;
const TIMEOUT = 15;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const _supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// Moralis.start({
//   apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
// });

export interface VerifyMessage {
  network: "evm";
  signature: string;
  message: string;
}

export async function verifyMessage({
  network,
  signature,
  message,
}: VerifyMessage) {
  const result = await Moralis.Auth.verify({
    network,
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
  }
  const token = 0;
  // const token = jwt.sign(
  //   {
  //     ...user,
  //     aud: "authenticated",
  //     role: "authenticated",
  //     exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  //   },
  //   process.env.SUPABASE_JWT
  //);

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

    setState((x) => ({ ...x, loading: true }));

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      chainId: 1,
      statement: "Sign in to ClariFi.",
      uri: window.location.origin,
      version: "1",
      nonce: state.nonce,
    });
    const signature = await signMessageAsync({
      message: message.prepareMessage(),
    });

    console.log(signature);
    console.log(message);
    // const { user } = await verifyMessage({ message, signature });

    // console.log(user);
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
