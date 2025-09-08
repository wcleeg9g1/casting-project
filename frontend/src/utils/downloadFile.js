// utils/downloadFile.js
export async function downloadFile(url, filename) {
  try {
    const res = await fetch(url, {
    //   credentials: 'include', // 필요 없으면 제거 가능
    });
    if (!res.ok) throw new Error("다운로드 실패");

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename; // 🔹 꼭 추가해야 다운로드됨

    // 🔹 일부 브라우저에서는 appendChild 필요
    document.body.appendChild(a); //일부 브라우저(특히 Firefox)는 클릭이 화면에 실제 존재하는 요소여야 다운로드 가능
    a.click(); //클릭 이벤트 트리거 → 파일 다운로드 시작
    document.body.removeChild(a); //사용 후 DOM에서 제거

    window.URL.revokeObjectURL(blobUrl); //메모리 해제
  } catch (err) {
    console.error(err);
  }
}
