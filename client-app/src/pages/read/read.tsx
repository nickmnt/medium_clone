import { convertFromRaw, Editor, EditorState } from "draft-js";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { CiPaperplane } from "react-icons/ci";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import { Article } from "../../app/models/article";
import { Comment } from "../../app/models/comment";
import { useStore } from "../../app/stores/store";
import { format } from "../../urils/jdate";
import "./read.css";

function Read() {
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<string>();
  const [sending, setSending] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const {
    userStore: { user },
    contentStore: {
      likeArticle,
      articles,
      saveArticle,
      savedArticles,
      profiles,
      userProfile,
    },
  } = useStore();

  useEffect(() => {
    if (!id) return;

    const article = articles.find((a) => a.id === +id);

    if (article) {
      setArticle(article);
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(article.body || ""))
        )
      );
      setLiked(
        article.likes.find((l) => l.username === user?.username) != null
      );

      setBookmarked(savedArticles.find((a) => a.id === article.id) != null);

      agent.requests
        .get<Comment[]>(`/Comments?articleId=${article.id}`)
        .then((cm) => {
          setComments(cm);
        });
      return;
    }

    navigate("/");
  }, [articles, savedArticles]);

  async function like() {
    setLiked(!liked);
    await likeArticle(id || "");
  }

  async function bookmark() {
    setBookmarked(!bookmarked);
    await saveArticle(id || "");
  }

  async function send() {
    setSending(true);
    await agent.requests.post("/Comments", { articleId: id, body: comment });

    agent.requests.get<Comment[]>(`/Comments?articleId=${id}`).then((cm) => {
      setSending(false);
      setComments(cm);
      setComment("");
    });
  }

  return (
    <div className="container read-container">
      <div className="article-read-top">
        <img className="read-img" src={process.env.REACT_APP_IMG_URL + `${article?.image}`} alt="image" />

        <h1>{article?.title}</h1>

        <div
          key={article?.author.username}
          className="author-box"
          style={{ marginBottom: "1rem" }}
        >
          <img
            className="avatar"
            src={
              article?.author.image
                ? process.env.REACT_APP_IMG_URL + `${article?.author.image}`
                : "https://api.dicebear.com/5.x/thumbs/svg"
            }
            alt="user avatar"
          />
          <div className="author-info">
            <div>
              <p className="author-name">{article?.author.displayName}</p>
            </div>
            <p className="author-bio">{article?.author.bio}</p>
          </div>
        </div>
      </div>
      <div className="read-content">
        <div className="actionbar">
          <div className="read-actions">
            <div onClick={like} className="read-action">
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span>{article?.likes.length}</span>
            </div>
            <div onClick={bookmark} className="read-action">
              {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </div>
          </div>
        </div>
        <div className="article-editor">
          <Editor
            editorState={editorState}
            readOnly={true}
            onChange={() => {}}
          />
        </div>
      </div>

      <h3>نظرات</h3>

      <div className="comment-section">
        {comments.map((c) => {
          const commenter = profiles.find((p) => p.username === c.username);
          if (commenter) {
            return (
              <div
                key={c.id}
                className="author-box"
                style={{ marginBottom: "2rem", alignItems: "flex-start" }}
              >
                <img
                  className="avatar"
                  src={
                    commenter?.image
                      ? process.env.REACT_APP_IMG_URL + `${commenter.image}`
                      : "https://api.dicebear.com/5.x/thumbs/svg"
                  }
                  alt="user avatar"
                />
                <div className="author-info">
                  <div>
                    <p className="author-name">{commenter?.displayName}</p>
                    <span className="bullet"></span>
                    <p className="article-date">{format(c.createdAt)}</p>
                  </div>
                  <p className="author-bio">{c.body}</p>
                </div>
              </div>
            );
          } else {
            console.log(c);
          }
        })}
        {user ? (
          <div className="write-comment">
            <img
              className="avatar"
              src={
                userProfile?.image
                  ? process.env.REACT_APP_IMG_URL + `${userProfile.image}`
                  : "https://api.dicebear.com/5.x/thumbs/svg"
              }
              alt="user avatar"
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              name="comment"
              id="comment"
              rows={1}
              placeholder="نظرتو بنویس..."
            ></textarea>
            {sending ? (
              <TailSpin
                height="20"
                width="20"
                color="var(--primary-color)"
                radius="6"
                wrapperStyle={{}}
                visible={true}
                ariaLabel="rings-loading"
              />
            ) : (
              <CiPaperplane onClick={send} fontSize={36} className="send" />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default observer(Read);
