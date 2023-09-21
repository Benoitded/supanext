import Image from "next/image";
import styles from "./page.module.css";
import supabase from "@/supabase";
import { useState } from "react";

export default function Login() {
  const [statusConnect, setStatusConnect] = useState<boolean | undefined>(
    undefined
  );

  const handleSignUp = async () => {
    console.log("Sign in");
    let { data, error } = await supabase.auth.signUp({
      email: "benoitded82@hotmail.fr",
      password: "Twist82000",
    });
    console.log(data);
    console.log(error);

    // Traiter les résultats de l'appel signInWithPassword ici
  };
  const handleNewSignUp = async () => {
    console.log("Sign in");
    let { data, error } = await supabase.auth.signUp({
      email: "saluttoii4343@yopmail.com",
      password: "azerty820",
    });
    console.log(data);
    console.log(error);

    // Traiter les résultats de l'appel signInWithPassword ici
  };

  const handleSignInInput = async () => {
    console.log("Sign in input");

    const mailElement = document.querySelector("#mail") as HTMLInputElement;
    const passwordElement = document.querySelector(
      "#password"
    ) as HTMLInputElement;

    if (mailElement && passwordElement) {
      const mail = mailElement.textContent ?? ""; // Utilise une chaîne vide si mailElement.textContent est null
      const password = passwordElement.textContent ?? ""; // Utilise une chaîne vide si passwordElement.textContent est null
      console.log(mail);
      console.log(password);

      let { data, error } = await supabase.auth.signUp({
        email: mail,
        password: password,
      });

      console.log(data);
      console.log(error);

      // Traiter les résultats de l'appel signUp ici
    } else {
      console.error("Les éléments mail et/ou password n'ont pas été trouvés.");
    }
  };

  const handleLogIn = async () => {
    try {
      console.log("Log in");
      let { data, error } = await supabase.auth.signInWithPassword({
        email: "benoitded82@hotmail.fr",
        password: "Twist82000",
      });
      console.log(data);
      console.log(error);
      if (data.session != null) {
        console.log(data);
        setStatusConnect(true);
      } else {
        console.log(error);
        setStatusConnect(false);
      }
    } catch (error) {
      console.log(error);
      setStatusConnect(false);
    }

    // Traiter les résultats de l'appel signInWithPassword ici
  };
  const handleLogIn2 = async () => {
    try {
      console.log("Log in");
      let { data, error } = await supabase.auth.signInWithPassword({
        email: "saluttoii4343@yopmail.com",
        password: "azerty820",
      });
      if (data.session != null) {
        console.log(data);
        setStatusConnect(true);
      } else {
        console.log(error);
        setStatusConnect(false);
      }
    } catch (error) {
      console.log(error);
      setStatusConnect(false);
    }

    // Traiter les résultats de l'appel signInWithPassword ici
  };
  const handleWrongLogIn = async () => {
    try {
      console.log("Log in");
      let { data, error } = await supabase.auth.signInWithPassword({
        email: "baby@hotmail.fr",
        password: "Twist82000",
      });
      if (data.session != null) {
        console.log(data);
        setStatusConnect(true);
      } else {
        console.log(error);
        setStatusConnect(false);
      }
    } catch (error) {
      console.log(error);
      setStatusConnect(false);
    }

    // Traiter les résultats de l'appel signInWithPassword ici
  };
  return (
    <div>
      <div>Hello login</div>
      <div>Mail</div>
      <input type="mail" name="" id="mail" />
      <div>Password</div>
      <input type="password" name="" id="password" />
      <button onClick={handleLogIn}>Log In</button>
      <button onClick={handleLogIn2}>Log In 2</button>
      <button onClick={handleWrongLogIn}>Wrong Log In</button>
      <button onClick={handleWrongLogIn}>Log in Input</button>
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleNewSignUp}>NewSign Up</button>
      <button onClick={handleSignInInput}>Sign in Input</button>
      {statusConnect ? "Connected" : "Wrong, try again"}
    </div>
  );
}
