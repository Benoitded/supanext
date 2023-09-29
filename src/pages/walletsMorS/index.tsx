// pages/walletMorS.tsx

import React, { useState, useEffect } from "react"; // Ensure you've imported useEffect.
import axios from "axios";
import { ethers } from "ethers";
import { createClient } from "@supabase/supabase-js";
import { useSignMessage, useAccount } from "wagmi";
import supabase from "@/services/authService";
import { Web3Button } from "@web3modal/react";

// import Moralis from "moralis";
// Moralis.start({
//   apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
// });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_PUBLIC_ANON_KEY = process.env
  .NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
let _supabaseAuthenticated: any;

const LOCAL_STORAGE_KEY =
  "sb-jwt-" + SUPABASE_URL.split(".")[0].replace("https://", "") + "auth-token";

const WalletMorS: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [listOrders, setListOrders] = useState<any[]>([]);
  const [storedMessage, setStoredMessage] = useState<string | null>(null); // Ajout de cet état pour stocker `message`
  const {
    data,
    error: errorM,
    isLoading: isLoadingM,
    signMessage,
    variables,
  } = useSignMessage();
  const { address, connector, isConnected } = useAccount();

  // const [supabase, setSupabase] = useState<any>(null);

  // const connectToMetamask = async () => {
  //   const provider = new ethers.providers.Web3Provider(
  //     window.ethereum as any,
  //     "any"
  //   );
  //   const [accounts, chainId] = await Promise.all([
  //     provider.send("eth_requestAccounts", []),
  //     provider.send("eth_chainId", []),
  //   ]);
  //   const signer = provider.getSigner();
  //   return { signer, chain: chainId, account: accounts[0] };
  // };

  const handleAuth = async () => {
    try {
      const responseMessage = await axios.post("/api/auth/request-message", {
        address: address,
        chain: 1,
        networkType: "evm",
      });
      const { message } = responseMessage.data;
      setStoredMessage(message); // Stocke le message dans l'état
      signMessage({ message });
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (data && storedMessage) {
      // Vérifie que `storedMessage` est aussi défini
      console.log(data);
      const executeWhenDataAvailable = async () => {
        const responseVerify = await axios.post("/api/auth/sign-message", {
          message: storedMessage, // Utilise storedMessage ici
          signature: data,
          networkType: "evm",
        });
        const userData = responseVerify.data;
        console.log("userData");
        console.log(userData);

        // Set the Supabase client with authorization headers
        _supabaseAuthenticated = createClient(
          SUPABASE_URL,
          SUPABASE_PUBLIC_ANON_KEY,
          {
            global: {
              headers: {
                Authorization: `Bearer ${userData.user.token}`,
              },
            },
          }
        );
        localStorage.setItem(
          "sb-jwt-" +
            SUPABASE_URL.split(".")[0].replace("https://", "") +
            "auth-token",
          JSON.stringify(userData)
        );
        setUser(userData);
      };

      executeWhenDataAvailable();
    }
  }, [data, storedMessage]); // Ajoute storedMessage dans la liste des dépendances

  const handleDisc = async () => {
    console.log("disconnect");
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
  };

  useEffect(() => {
    if (user) {
      // Check if the user is set.
      loadOrders();
    } else {
      setListOrders([]);
    }
  }, [user]); // Dependency array to run this effect whenever `user` changes.

  useEffect(() => {
    console.log("first");
    const storedItem = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!storedItem) {
      console.log("Item not found in localStorage");
      return;
    }

    const userData = JSON.parse(storedItem);
    console.log(userData);
    if (userData != null) {
      console.log("pas nul");
      _supabaseAuthenticated = createClient(
        SUPABASE_URL,
        SUPABASE_PUBLIC_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${userData.user.token}`,
            },
          },
        }
      );
      setUser(userData);
      console.log(_supabaseAuthenticated);
    }
  }, []);

  // useEffect(() => {
  //   console.log(listOrders);
  // }, [listOrders]);
  useEffect(() => {
    console.log(address);
    const storedItem = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedItem) {
      console.log("Item not found in localStorage");
      return;
    }
    const userData = JSON.parse(storedItem);
    let addressLocal = userData.user.user.metadata.address;
    if (addressLocal == address) {
      console.log("same address");
      setUser(userData);
    } else {
      console.log("different address");
      setUser(null);
    }
  }, [address]);

  const getUser = async () => {
    try {
      if (!_supabaseAuthenticated) {
        throw new Error("You need to authenticate with Metamask first.");
      }

      console.log("_supabaseAuthenticated");
      console.log(_supabaseAuthenticated);
      const { data, error } = await _supabaseAuthenticated
        .from("users")
        .select("*");

      if (error) {
        console.error("Supabase error:", error); // Log the Supabase error for more details
        throw error;
      }

      console.log("Fetched data:", data); // Check if data is being fetched correctly

      setUser(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  const addLine = async () => {
    try {
      const { data, error } = await _supabaseAuthenticated
        .from("orders2")
        .insert([{ command: "Bienvenue", quantity: 34 }]);
      if (error) {
        console.error("Supabase error:", error); // Log the Supabase error for more details
        throw error;
      }
      loadOrders();
    } catch (err: any) {
      console.log(err.message);
      setError(err.message || "An error occurred.");
    }
  };

  const deleteLine = async (index: number) => {
    try {
      console.log("delete" + index);
      const { error } = await _supabaseAuthenticated
        .from("orders2")
        .delete()
        .eq("id", index);

      // const { data, error } = await _supabaseAuthenticated
      //   .from("orders2")
      //   .insert([{ command: "Bienvenue", quantity: 34 }]);
      if (error) {
        console.error("Supabase error:", error); // Log the Supabase error for more details
        throw error;
      }
      loadOrders();
    } catch (err: any) {
      console.log(err.message);
      setError(err.message || "An error occurred.");
    }
  };

  const loadOrders = async () => {
    try {
      if (!_supabaseAuthenticated) {
        throw new Error("You need to authenticate with Metamask first.");
      }
      console.log(user);
      console.log(user?.user?.user?.id);
      if (!user?.user?.user?.id) {
        console.log("c'est MORT, on charge pas les orders");
        throw new Error("User UUID not found.");
      }

      const { data, error } = await _supabaseAuthenticated
        .from("orders2")
        .select("*")
        .eq("uuid", user?.user?.user?.id);
      console.log("data load");
      console.log(data);

      if (error) {
        throw error;
      }

      setListOrders(data || []);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  const handleInputChange = (index: number, newValue: string) => {
    const updatedOrders = [...listOrders];
    updatedOrders[index].command = newValue;
    setListOrders(updatedOrders);
  };

  const handleUpdateCommand = async (id: string, newValue: string) => {
    try {
      const { error } = await _supabaseAuthenticated
        .from("orders2")
        .update({ command: newValue })
        .eq("id", id);

      if (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  return (
    <div>
      <h1>Demo Auth Supabase</h1>
      {address ? (
        <button onClick={handleAuth}>Authenticate via Metamask</button>
      ) : (
        <Web3Button />
      )}
      <button onClick={handleDisc}>Disconnect</button>
      <button onClick={getUser}>Get User</button>
      <button onClick={addLine}>Add Line</button>
      {listOrders &&
        listOrders.map((e, index) => (
          <div key={e.id} style={{ display: "flex", gap: "5px" }}>
            <input
              type="text"
              value={e.command}
              onChange={(event) => handleInputChange(index, event.target.value)}
              onBlur={(event) => handleUpdateCommand(e.id, event.target.value)}
            />
            <div>{e.quantity}</div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => deleteLine(e.id)}
              title="Delete the line"
            >
              x
            </div>
          </div>
        ))}

      <div>
        {user ? (
          <pre>{JSON.stringify(user, null, 2)}</pre>
        ) : (
          "Please authenticate to see user data."
        )}
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default WalletMorS;
