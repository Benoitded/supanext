import { useState, useEffect } from "react";
import Image from "next/image";
import supabase from "@/supabase";
import styles from "./Orders.module.css";

interface Order {
  id: number;
  command: string;
  quantity: number;
  // ... d'autres propriétés ici si nécessaire
}

export default function Orders() {
  const [listOrders, setListOrders] = useState<Order[]>([]);
  const handleGetOrders = async () => {
    try {
      console.log("Get orders");
      let { data: orders, error } = await supabase.from("orders").select("*");
      if (orders) {
        console.log(orders);
        setListOrders(orders || []);
      }
    } catch (error) {
      console.log(error);
    }
    // Traiter les résultats de l'appel signInWithPassword ici
  };

  const handleAddOrder = async () => {
    try {
      console.log("Add orders");
      const command = document.querySelector("#command").value || null;
      const quantity = document.querySelector("#quantity").value;
      const { data, error } = await supabase
        .from("orders")
        .insert([{ command: command, quantity: quantity }])
        .select();
      handleGetOrders();
      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLine = async () => {
    try {
      console.log("Delete line");
      const lastOrder = listOrders[listOrders.length - 1];
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", lastOrder.id);
      handleGetOrders();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetOrders();
  }, []);

  return (
    <main className={styles.mainOrder}>
      <div>Hello orders</div>
      <div className={styles.addOrder}>
        <input type="text" placeholder="command" id="command" />
        <input type="number" placeholder="quantity" id="quantity" />
        <button onClick={handleAddOrder}>Add line</button>
        <button onClick={handleDeleteLine}>Delete last line</button>
      </div>
      {listOrders.map((e) => (
        <div key={e.id} className={styles.itemOrders}>
          <div>{e.command}</div>
          <div>{e.quantity}</div>
        </div>
      ))}
    </main>
  );
}
