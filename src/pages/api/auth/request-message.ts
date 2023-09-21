import { NextApiRequest, NextApiResponse } from "next";
import { requestMessage } from "../../../services/authService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("gooo");
    const { address, chain, networkType } = req.body;
    const message = await requestMessage({ address, chain, networkType });

    res.status(200).json({ message });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
