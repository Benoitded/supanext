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
  const [commandInput, setCommandInput] = useState("");
  const [quantityInput, setQuantityInput] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetOrders = async () => {
    try {
      console.log("Get orders");
      let { data: orders, error } = await supabase.from("orders2").select("*");
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
      if (!commandInput || !quantityInput) {
        setError(
          "Assurez-vous que les champs de commande et de quantité sont remplis."
        );
        return;
      }
      const { data, error } = await supabase
        .from("orders2")
        .insert([{ command: commandInput, quantity: quantityInput }]);
      handleGetOrders();
      if (error) throw error;
      if (data) {
        setListOrders([...listOrders, ...data]);
        setCommandInput("");
        setQuantityInput(null);
        setError(null); // Réinitialisez l'erreur lorsque tout va bien
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de l'ajout de la commande.");
      console.error(err);
    }
  };

  const handleDeleteLine = async () => {
    try {
      console.log("Delete line");
      const lastOrder = listOrders[listOrders.length - 1];
      const { error } = await supabase
        .from("orders2")
        .delete()
        .eq("id", lastOrder.id);
      handleGetOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (index: number, newCommand: string) => {
    const updatedOrders = [...listOrders];
    updatedOrders[index].command = newCommand;
    setListOrders(updatedOrders);
  };

  const handleUpdateCommand = async (id: number, newCommand: string) => {
    try {
      const { data, error } = await supabase
        .from("orders2")
        .update({ command: newCommand })
        .eq("id", id);
      if (error) throw error;
      const updatedOrders = listOrders.map((order) =>
        order.id === id ? { ...order, command: newCommand } : order
      );
      setListOrders(updatedOrders);
    } catch (err) {
      setError(
        "Une erreur s'est produite lors de la mise à jour de la commande."
      );
      console.error(err);
    }
  };

  useEffect(() => {
    handleGetOrders();
  }, []);

  return (
    <main className={styles.mainOrder}>
      <div>Hello orders</div>
      <div className={styles.addOrder}>
        <input
          type="text"
          placeholder="command"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
        />
        <input
          type="number"
          placeholder="quantity"
          value={quantityInput ?? ""}
          onChange={(e) => setQuantityInput(Number(e.target.value))}
        />
        <button onClick={handleAddOrder}>Add line</button>
        <button onClick={handleDeleteLine}>Delete last line</button>
      </div>
      {listOrders.map((e, index) => (
        <div key={e.id} className={styles.itemOrders}>
          {/* <input>{e.command}</input> */}
          <input
            type="text"
            value={e.command}
            onChange={(event) => handleInputChange(index, event.target.value)}
            onBlur={(event) => handleUpdateCommand(e.id, event.target.value)}
          />
          <div>{e.quantity}</div>
        </div>
      ))}
    </main>
  );
}
