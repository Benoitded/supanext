import { NextApiRequest, NextApiResponse } from "next";
import { getTimestamp } from "../../services/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const timestamp = getTimestamp();
    console.log(getTimestamp());

    res.status(200).json({ timestamp });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
