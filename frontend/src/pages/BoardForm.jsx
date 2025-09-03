import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { fetchWithAuth } from "../auth/fetchWithAuth";

export default function BoardForm() {
  const { id } = useParams(); // 수정할 때만 id 존재
  const isEdit = Boolean(id);
  const { access, refresh } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const res = await fetchWithAuth(`http://localhost:8000/api/posts/${id}/`, {}, () => access, refresh);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setContent(data.content);
        }
      })();
    }
  }, [id, isEdit, access, refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `http://localhost:8000/api/posts/${id}/`
      : "http://localhost:8000/api/posts/";

    const res = await fetchWithAuth(
      url,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      },
      () => access,
      refresh
    );

    if (res.ok) {
      navigate("/board");
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
      <button type="submit">{isEdit ? "수정" : "작성"}</button>
    </form>
  );
}
