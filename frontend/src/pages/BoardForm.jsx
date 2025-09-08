import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { fetchWithAuth } from "../auth/fetchWithAuth";
import { downloadFile } from "../utils/downloadFile";

export default function BoardForm() {
  const { id } = useParams(); // 수정할 때만 id 존재
  const isEdit = Boolean(id);
  const { access, refresh } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // 업로드할 파일들 
  const [existingFiles, setExistingFiles] = useState([]); // 기존 업로드 파일목록 
  const [deletedFileIds, setDeletedFileIds] = useState([]); // 🔹 삭제될 기존 파일 ID 추적
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const res = await fetchWithAuth(`http://localhost:8000/api/posts/${id}/`, {}, () => access, refresh);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setContent(data.content);

          //기존 업로드 파일목록 세팅 
          if(data.files) {
            setExistingFiles(data.files); 
          }
        }
      })();
    }
  }, [id, isEdit, access, refresh]);

  //파일 선택시 
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files); 
    setFiles((prevFiles)=>[...prevFiles, ...newFiles]); // 선택파일들 세팅  FileList → Array 변환
    e.target.value = null
  }

  // 기존 파일 삭제
  const handleExistingFileRemove = (fileId) =>{
    setExistingFiles(existingFiles.filter((f) => f.id !== fileId)); 
    setDeletedFileIds([...deletedFileIds, fileId]); // 🔹 삭제될 ID 기록
  }
  
  // 신규추가파일 삭제 
  const handleNewFileRemove = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `http://localhost:8000/api/posts/${id}/`
      : "http://localhost:8000/api/posts/";
    
    // formData 생성 
    const formData = new FormData();
    formData.append("title", title); 
    formData.append("content", content); 
    
    // 새로 선택된 파일 다중 추가 
    files.forEach((file) => formData.append("files", file))
    // for(let i = 0; i < files.length; i++){
    //     formData.append("files", files[i]);  // 백엔드에서 files필드로 받음 
    // }

    // 삭제된 기존파일 ID 전송 (bakend 삭제 처리 필요)
    if (deletedFileIds.length > 0) {
      formData.append("removed_files", JSON.stringify(deletedFileIds)); // 🔹 기존 파일 삭제 처리용
    }

    // fetchWithAuth 호출 (Content-Type 자동으로 multipart/form-data 처리)
    const res = await fetchWithAuth (
      url,
      {
        method,
        // headers: { "Content-Type": "application/json" },
        body: formData
        // body: JSON.stringify({ title, content }),
      },
      () => access,
      refresh
    );

    if (res.ok) {
      const data = await res.json(); // 새로 생성된 글 정보
      if(isEdit) {
        navigate(`/board/${id}`); 
      } else {
        navigate(`/board/${data.id}`); 
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <h2>{isEdit ? "글 수정" : "글쓰기"}</h2>
        <div>
            <input
                type="text"
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />  
        </div>
        <div>
            <textarea
                placeholder="내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
        {/* 파일 선택 input (선택한 파일 이름 안보이게) */}
        <div>
            <input
                id="fileInput"
                key={files.length}   // 파일 목록이 변할 때마다 새 input
                type="file"  
                multiple  //다중파일 선택 허용 
                onChange={handleFileChange} 
                style={{ display: "none" }} // ✅ input 숨기기
                />
            {/* 커스텀 버튼 (label로 연결) */}
            <label
                htmlFor="fileInput"
                style={{
                display: "inline-block",
                padding: "6px 12px",
                backgroundColor: "#007bff",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
                }}
            >
                파일 선택
            </label>
        </div>
        {/* 기존 + 새 파일 목록 */}
        <div style={{marginTop: 10}}>
            <h4>파일목록</h4>
            <ul>
                {existingFiles.map((f)=> {
                    const encodedName = f.file.split("/").pop(); // pop으로 마지막 요소 꺼냄 .. 
                    const decodedName = decodeURIComponent(encodedName); 
                    return (
                    <li key={f.id} > 
                        {/* <a href={f.file} target="_blank" rel="noopener noreferrer">
                            {f.file.split("/").pop()}
                        </a> */}
                        <button
                            type="button"  // 🔹 기본 submit 방지
                            onClick = {() => {
                                downloadFile(`http://localhost:8000/api/download/${f.id}/`, decodedName)
                            }}>

                            {decodedName} {/* 파일명 표시 */}
                        </button>
                        
                        {/* 삭제 버튼 */}
                        <button type="button" onClick={()=> handleExistingFileRemove(f.id)}>
                            X
                        </button>
                    </li>
                    )
                })}
                {files.map((f, idx) => (
                    <li
                    key={idx}
                    >
                    {f.name} {/* 🔹 새로 선택한 파일 이름 표시 */}
                    <button type="button" onClick={() => handleNewFileRemove(idx)}> {/* 🔹 삭제 버튼 */}
                        X
                    </button>
                    </li>
                ))}
            </ul>
        </div>
        <button type="submit">{isEdit ? "수정" : "작성"}</button>
        <button onClick={() => navigate("/board")}>목록</button>
        
    </form>
  );
}
