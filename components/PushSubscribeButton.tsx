"use client";
import { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY = "BLRvaJmdmqaEfi6czaYWOiR7UZORHwC0hpwIG3Csgjcc4ojBfWDY5eSmZKCpDffBnlJAvwpR6D5TF0o65chK7TQ";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function PushSubscribeButton() {
  const [status, setStatus] = useState<"idle" | "subscribed" | "unsupported" | "denied">("idle");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    navigator.serviceWorker.register("/sw.js").then(async (reg) => {
      const existing = await reg.pushManager.getSubscription();
      if (existing) setStatus("subscribed");
    });
  }, []);

  const subscribe = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus("denied");
      return;
    }
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });
    setStatus("subscribed");
  };

  if (status === "unsupported" || status === "subscribed") return null;

  return (
    <button
      onClick={subscribe}
      className="rounded-full border border-zellige/30 px-4 py-2 text-sm font-semibold text-zellige dark:border-saffron/30 dark:text-saffron"
    >
      Activer les rappels
    </button>
  );
}
