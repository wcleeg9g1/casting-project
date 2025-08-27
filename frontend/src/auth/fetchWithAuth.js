// getAccessFn에서 가져온 액세스를 사용해 보호된 API를 호출하는 간단한 헬퍼
// 액세스가 없거나 401 에러가 발생하면 tryRefreshFn을 사용해 갱신을 시도함

export async function fetchWithAuth(url, options = {}, getAccessFn, tryRefreshFn) {
  let access = getAccessFn();
  if (!access) {
    const newAccess = await tryRefreshFn();
    // if (!newAccess) throw new Error("Not authenticated");
    if (!newAccess) return null;
    access = newAccess;
  }
  const headers = options.headers ? { ...options.headers } : {};
  headers["Authorization"] = `Bearer ${access}`;
  let res = await fetch(url, { ...options, headers, credentials: "include" });
  if (res.status === 401) {
    // 액세스 토큰 갱신을 한 번만 시도
    const newAccess = await tryRefreshFn();
    // if (!newAccess) throw new Error("Not authenticated");
    if (!newAccess) return null;
    headers["Authorization"] = `Bearer ${newAccess}`;
    res = await fetch(url, { ...options, headers, credentials: "include" });
  }
  return res;
}
