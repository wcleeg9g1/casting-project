import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { fetchWithAuth } from "../auth/fetchWithAuth";

export default function Home() {
  const { access, refresh, setAccess} = useAuth();
  const [me, setMe] = useState(null);

  useEffect(() => {
    // 토큰이 없으면 API 요청하지 않음
    // if (!access || !refresh) {
    //   setMe(null);
    //   return;
    // }

    (async () => {
    //   try {
        const res = await fetchWithAuth("http://localhost:8000/api/auth/me/", {}, () => access, refresh);
        if (res && res.ok) {
          const data = await res.json();
          setMe(data);
        } else {
          setMe(null);
        }
    //   } catch (err) {
    //     console.error(err);
    //     setMe(null);
    //   }
    })();
  }, [access, refresh]);

  return <div style={{ padding: 20 }}>{me ? `Hello ${me.username}` : "Not logged in"}</div>;
}
