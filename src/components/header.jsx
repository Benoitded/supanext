import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
// import { useAuth } from "@/composables/useAuth";
import { createClient } from "@supabase/supabase-js";
import { Web3Button } from "@web3modal/react";

import supabase from "@/supabase";

export default function Header() {
  const [user, setUser] = useState();

  async function getAuth() {
    const { data } = await supabase.auth.getUser();
    console.log(supabase);
    console.log(data);
  }
  supabase.auth.onAuthStateChange((event, session) => {
    // console.log(session);
    if (session && session.user) {
      setUser(session.user.email);
      //   console.log(session.user);
    } else {
      setUser("Nop");
    }
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  useEffect(() => {
    console.log(user);
    getAuth();
  }, [user]);
  return (
    <div className={styles.mainHeader}>
      <Link href="/">Go to Accueil</Link>
      <Link href="/login">Go to login</Link>
      <Link href="/orders">Go to orders</Link>
      <Link href="/wallets">Wallets</Link>
      <Link href="/walletsMorS">WalletsMorS</Link>
      <Web3Button />
      <div
        onClick={handleSignOut}
        style={{ cursor: "pointer" }}
        title="Sign out"
      >
        {user}
      </div>
    </div>
  );
}
