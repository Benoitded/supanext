import { NextApiRequest, NextApiResponse } from "next";
import { verifyMessage } from "../../../services/authService";
import Moralis from "moralis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("sign message");
    let MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: MORALIS_API_KEY,
      });
    }

    const { networkType, message, signature } = req.body;
    const user = await verifyMessage({
      networkType,
      message,
      signature,
    });

    // res.cookie("jwt", token, { httpOnly: true });
    res.status(200).json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
