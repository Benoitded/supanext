import { NextApiRequest, NextApiResponse } from "next";
import { requestMessage } from "../../../services/authService";
import Moralis from "moralis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("gooo");
    let MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
    Moralis.start({
      apiKey: MORALIS_API_KEY,
    });
    const { address, chain, networkType } = req.body;

    const message = await requestMessage({
      address,
      chain,
      networkType,
    });

    res.status(200).json({ message });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
