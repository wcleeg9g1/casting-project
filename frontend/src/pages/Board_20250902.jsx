// frontend/src/pages/Board.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { fetchWithAuth } from "../auth/fetchWithAuth";
import { useNavigate } from "react-router-dom";

export default function Board() {
    const { access, refresh } = useAuth();
    const [posts, setPosts] = useState([]);
    // const [page, setPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1); 
    const [pageInfo, setPageInfo] = useState({ current: 1, total: 1 });
    const navigate = useNavigate();

    const fetchPosts = async (page = 1) => {
        try {
            const res = await fetchWithAuth(
                `http://localhost:8000/api/posts/?page=${page}`,
                {},
                () => access,
                refresh
            );
            if (res && res.ok) {
                const data = await res.json();
                setPosts(data.results); // DRF 페이징 기본 key: results
                // setTotalPages(Math.ceil(data.count / 5)); // PAGE_SIZE 5 기준
                data.page_size = 5;
                setPageInfo({ current: page, total: Math.ceil(data.count / data.page_size) });
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPosts(1);
    }, [access, refresh]);

    // const handlePrev = () => page > 1 && setPage(page - 1);
    // const handleNext = () => page < totalPages && setPage(page + 1);

    return (
        <div className="posts-container">
            <div className="board-header">
                <h2>게시판</h2>
                <button onClick={() => navigate("/board/new")}>✏️글쓰기</button>
            </div>
            <div className="board-list">
                <table className="board-table">
                    <thead>
                    <tr>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {posts.map(post => (
                        <tr
                        key={post.id}
                        className="board-row"
                        onClick={() => navigate(`/board/${post.id}`)}
                        >
                        <td>{post.title}</td>
                        <td>{post.author_username}</td>
                        <td>{new Date(post.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                 {/* 페이지네이션 버튼 */}
                <div className="pagination">
                    <button onClick={() => fetchPosts(1)} disabled={pageInfo.current === 1}>
                    ⏮️ 처음
                    </button>
                    <button
                    onClick={() => fetchPosts(pageInfo.current - 1)}
                    disabled={pageInfo.current === 1}
                    >
                    ◀ 이전
                    </button>
                    <span>
                    {pageInfo.current} / {pageInfo.total}
                    </span>
                    <button
                    onClick={() => fetchPosts(pageInfo.current + 1)}
                    disabled={pageInfo.current === pageInfo.total}
                    >
                    다음 ▶
                    </button>
                    <button
                    onClick={() => fetchPosts(pageInfo.total)}
                    disabled={pageInfo.current === pageInfo.total}
                    >
                    ⏭ 마지막
                    </button>
                </div>
            </div>
        {/* {posts.map(post => (
            <div
            key={post.id}
            style={{
                borderBottom: "1px solid #ccc",
                marginBottom: 10,
                paddingBottom: 10,
                cursor: "pointer",
            }}
            className="post-item"
            onClick={() => navigate(`/board/${post.id}`)} // 상세 페이지 이동
            >
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <small>작성자: {post.author_username} | 작성일: {new Date(post.created_at).toLocaleString()}</small>
            </div>
        ))} */}
        </div>
    );
}
