import Moralis from "moralis";
import { createClient } from "@supabase/supabase-js";
// import config from "../config";
var jwt = require("jsonwebtoken");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_SERVICE_KEY = process.env
  .NEXT_PUBLIC_SUPABASE_SERVICE_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default supabase;

export interface RequestMessage {
  address: string;
  chain: string;
  networkType: string;
}

const STATEMENT = "Please sign this message to confirm your identity.";
const EXPIRATION_TIME = 900000;
const TIMEOUT = 15;

export async function requestMessage({
  address,
  chain,
  networkType,
}: {
  address: string;
  chain: string;
  networkType: "evm";
}) {
  console.log("req mes");
  const url = new URL(SUPABASE_URL);
  const now = new Date();
  const expirationTime = new Date(now.getTime() + EXPIRATION_TIME);
  const result = await Moralis.Auth.requestMessage({
    address,
    chain,
    networkType,
    domain: "localhost",
    statement: STATEMENT,
    uri: "http://localhost:3000",
    notBefore: now.toISOString(),
    expirationTime: expirationTime.toISOString(),
    timeout: TIMEOUT,
  });

  const { message } = result.toJSON();

  return message;
}

export interface VerifyMessage {
  networkType: "evm";
  signature: string;
  message: string;
}

export async function verifyMessage({
  networkType,
  signature,
  message,
}: VerifyMessage) {
  console.log("deep div verif");

  const result = await Moralis.Auth.verify({
    networkType,
    signature,
    message,
  });

  const authData = result.toJSON();
  console.log(authData);

  let { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("moralis_provider_id", authData.profileId)
    .single();

  console.log("user");
  console.log(user);

  if (!user) {
    const response = await supabase
      .from("users")
      .insert({ moralis_provider_id: authData.profileId, metadata: authData })
      .single();
    user = response.data;
    console.log("pas user");
    console.log(user);
  }
  console.log("sub claim");
  console.log(user.id);
  const token = jwt.sign(
    {
      ...user,
      sub: user.id,
      aud: "authenticated",
      role: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    process.env.NEXT_PUBLIC_JWT_SECRET
  );

  return { user, token };
}
