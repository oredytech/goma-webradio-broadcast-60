import { useEffect, useRef } from "react";
import { useWordpressArticles } from "@/hooks/useWordpressArticles";
import { toast } from "sonner";

export function useArticleNotifications() {
  const { data: articles } = useWordpressArticles();
  const askedRef = useRef(false);

  // Ask permission (non-blocking) with a toast action
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const alreadyAsked = localStorage.getItem("notifications:asked");
    if (Notification.permission === "default" && !alreadyAsked && !askedRef.current) {
      askedRef.current = true;
      setTimeout(() => {
        toast("Recevoir des alertes pour les nouveaux articles ?", {
          action: {
            label: "Activer",
            onClick: async () => {
              const perm = await Notification.requestPermission();
              localStorage.setItem("notifications:asked", "1");
              if (perm !== "granted") {
                toast.info("Notifications non activées");
              } else {
                toast.success("Notifications activées");
              }
            },
          },
          cancel: { label: "Plus tard" },
          duration: 8000,
        });
      }, 3000);
    }
  }, []);

  // Notify when a new article appears (app open)
  useEffect(() => {
    if (!articles || !articles.length || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const lastSeenId = Number(localStorage.getItem("notifications:lastArticleId") || 0);
    const latest = articles[0];
    if (!latest) return;

    if (latest.id && Number(latest.id) > lastSeenId) {
      try {
        const title = typeof latest.title === "string" ? latest.title : latest.title.rendered;
        const cleanTitle = title.replace(/<[^>]*>/g, "");
        const body = typeof latest.excerpt === "string" ? latest.excerpt : latest.excerpt.rendered;
        const cleanBody = body.replace(/<[^>]*>/g, "").slice(0, 120);
        // Show system notification
        new Notification(cleanTitle || "Nouveau", {
          body: cleanBody,
          icon: "/pwa-192x192.png",
          badge: "/pwa-192x192.png",
        });
        localStorage.setItem("notifications:lastArticleId", String(latest.id));
      } catch {}
    }
  }, [articles]);
}
