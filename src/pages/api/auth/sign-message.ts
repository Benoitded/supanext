import { NextApiRequest, NextApiResponse } from "next";
import { verifyMessage } from "../../../services/authService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("sign message");

    const { networkType, message, signature } = req.body;
    const user = await verifyMessage({
      networkType,
      message,
      signature,
    });
    console.log("both");
    console.log(user);
    // console.log(token);

    // res.cookie("jwt", token, { httpOnly: true });
    res.status(200).json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
