import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './BooksPostData.css'
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';


function BooksPostData() {

    const { id } = useParams("");
    const { postId } = useParams("");

    const [postList, setPostList] = useState("");
    const [postDescription, setPostDescription] = useState("");

    const [navigateData, setNavigateData] = useState("")
    const [navigateId, setNavigateId] = useState("");

    const [test, setTest] = useState(false)

    const [scroll, setScroll] = useState(false)

    const navigate = useNavigate("");


    useEffect(() => {
        getBooksData();
        getBooksReviewData();
    }, [postId])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll); //clean up
        };
    }, []);

    const getBooksData = () => {
        axios.get(`http://127.0.0.1:8000/api/books/${id}/post/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        }).then(res => {
            setNavigateData(res.data)
            setNavigateId(res.data[0].id);
        }).catch(error => {

        })
    }

    const handleScroll = () => {
        // 스크롤이 Top에서 50px 이상 내려오면 true값을 useState에 넣어줌
        if (window.scrollY >= 300) {
            setScroll(true);
        } else {
            // 스크롤이 50px 미만일경우 false를 넣어줌
            setScroll(false);
        }
    }

    const getBooksReviewData = () => {
        axios.get(`http://127.0.0.1:8000/api/books/${id}/post/${postId}/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        }).then(res => {
            setPostList(res.data)
            const description = res.data.description.replaceAll("\n" , "\n\n")
            setPostDescription(description)
        })
        .catch(error => {

        })
    }

    const goBooksData = (itemId) => {
        navigate(`/board/categorybooks/${id}/postreview/${itemId}`);
    }

    const handleRemoveBtn = (e) => {
        if (window.confirm("정말 삭제하시겠습니까?") === true) {
            axios.delete(`http://127.0.0.1:8000/api/books/${id}/post/${postId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            })
                .then(res => {
                    if (navigateData === null) {
                        navigate(`/board/categorybooks/${id}`)
                    } else {
                        navigate(`/board/categorybooks/${id}/postreview/${navigateId}`);
                        getBooksData();
                    }
                })
        }
        // 포스트 삭제 시 관련 이미지룰 db에서 지워줘야 한다
    }

    return (
        <>
            <div className='Review_page'>
                <div className='Review_title'>
                    {postList && <>
                        <ReactMarkdown className='markdown_title' children={postList.title} />
                    </>
                    }
                </div>
                <div className='Review_content'>
                    {postList &&
                        <>
                            <ReactMarkdown
                                children={postDescription}
                            />
                        </>
                    }
                </div>
            </div>
            <div>
                <div style={{ position: "absolute", top: "58px" }}>
                    <div className="Navigations_var"  >
                        {navigateData && navigateData.map((item, index) => (
                            <>
                                <div className={item.id === postList.id ? "selected" : "unSelected"} onClick={() => goBooksData(item.id)}><a><img src={`${process.env.PUBLIC_URL}/img/Note.png`} />    {item.title}</a></div>
                            </>
                        ))}
                        {navigateData && navigateData === null && (
                            <>
                            </>
                        )}
                        <div className='add_booksBtn' onClick={() => navigate(`/board/categoryBooks/${id}/write`)}><a><img src={`${process.env.PUBLIC_URL}/img/Add_books.png`} />&nbsp;<span>add Books</span></a></div>
                    </div>
                    <div className='remove_Btn' >
                        <button style={{ marginRight: "10px" }} onClick={() => navigate(`/board/CategoryBooks/${id}/changeReview/${postId}`)}>수정하기</button>
                        <button style={{ backgroundColor: "#e62e3d", color: "white" }} onClick={() => handleRemoveBtn()}>삭제하기</button>
                    </div>
                    <div className='prev_btn'>
                        <img /><button onClick={() => navigate(`/board/CategoryBooks/${id}`)}>이전 페이지</button>
                    </div>
                </div>
            </div>
            {scroll &&
                <div className='scrollUpBtn'>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img src={`${process.env.PUBLIC_URL}/img/arrow_up.png`} />
                    </button>
                </div>
            }
        </>
    )
}

export default BooksPostData