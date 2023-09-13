const Moralis = require("moralis").default;

Moralis.start({
  apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
});

export async function requestMessage({
  address,
  chain,
  network,
}: {
  address: string;
  chain: string;
  network: "evm";
}) {
  const result = await Moralis.Auth.requestMessage({
    address,
    chain,
    network,
    domain: "defi.finance",
    statement: "Please sign this message to confirm your identity.",
    uri: "https://defi.finance",
    expirationTime: "2023-01-01T00:00:00.000Z",
    timeout: 15,
  });

  const { message } = result.toJSON();

  return message;
}

export async function verifyMessage({
  networkType,
  signature,
  message,
}: VerifyMessage) {
  console.log("---verify external---");
  console.log(networkType);
  console.log(signature);
  console.log(message);
  const result = await Moralis.Auth.verify({
    networkType,
    signature,
    message,
  });
  const authData = result.toJSON();

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

  const token = jwt.sign(
    {
      ...user,
      aud: "authenticated",
      role: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    config.SUPABASE_JWT
  );

  return { user, token };
}
