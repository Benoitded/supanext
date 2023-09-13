import Image from "next/image";
import styles from "./page.module.css";
import supabase from "@/supabase";
// let { data, error } = await supabase.auth.signInWithPassword({
//   email: "someone@email.com",
//   password: "slyTIqdPgTAIiZgzOXoX",
// });
export default function Home() {
  return (
    <div>
      <div>Hello world dans app</div>
      <div>Mail</div>
      <input type="mail" name="" id="" />
      <div>Password</div>
      <input type="password" name="" id="" />
      <button>Sign in</button>
    </div>
  );
}
