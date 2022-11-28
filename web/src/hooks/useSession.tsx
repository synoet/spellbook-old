import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

export default function useSession() {
  const [session, setSession] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [status, setStatus] = useState<
    "unauthenticated" | "authenticated" | "loading"
  >("unauthenticated");

  const fetchWhoAmI = async () => {
    const response = await axios.get("/api/auth/whoami");
    return response.data;
  };

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("spellbook_auth_token");
    if (!!token) {
      setStatus("unauthenticated");
      setIsSessionLoading(false);
    } else {
      setStatus("loading");
      fetchWhoAmI().then((data) => {
        setSession(data);
        setStatus("authenticated");
        setIsSessionLoading(false);
      });
    }
  }, []);

  return { session, isSessionLoading, status };
}
