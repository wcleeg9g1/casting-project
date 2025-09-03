import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { fetchWithAuth } from "../auth/fetchWithAuth";

export default function BoardDetail() {
  const { id } = useParams();
  const { access, refresh } = useAuth(); 
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // 🔹 현재 로그인 사용자
  const navigate = useNavigate();

   useEffect(() => {
    // 🔹 현재 사용자 정보 가져오기 (로그인 안한 경우 null)
    if (refresh) {
      (async () => {
        try {
          const res = await fetchWithAuth("http://localhost:8000/api/auth/me/", {}, () => access, refresh);
          if (res.ok) {
            const data = await res.json();
            // console.log(data)
            setCurrentUser(data.username);
          }
        } catch (err) {
        //   console.log('하하하')
        }
      })();
    }
  }, [access, refresh]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://localhost:8000/api/posts/${id}/`);
      if (res.ok) {
        setPost(await res.json());
      }
    })();
  }, [id, access, refresh]);

  const handleDelete = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      const res = await fetchWithAuth(`http://localhost:8000/api/posts/${id}/`, { method: "DELETE" }, () => access, refresh);
      if (res.ok) {
        navigate("/board");
      }
    }
  };

  if (!post) return <div>Loading...</div>;

  const isAuthor = access && currentUser && post.author_username === currentUser;
//   console.log( access); 

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <small>작성자: {post.author_username}</small>
     <div style={{ marginTop: "1rem" }}>
        {isAuthor && (
          <>
            <Link to={`/board/${id}/edit`} style={{ marginRight: "0.5rem" }}>수정</Link>
            <button onClick={handleDelete}>삭제</button>
          </>
        )}
      </div>
    </div>
  );
}
