import { convertFromRaw, Editor, EditorState } from "draft-js";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { Article } from "../../app/models/article";
import { useStore } from "../../app/stores/store";
import Header from "../../components/header/header";
import "./read.css";

function Read() {
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article>();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const {
    userStore: { user },
    contentStore: { likeArticle, articles, saveArticle, savedArticles },
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

  return (
    <>
      <Header />
      <div className="container read-container">
        <div className="article-read-top">
          <h1>{article?.title}</h1>

          <div
            key={article?.author.username}
            className="author-box"
            style={{ marginBottom: "1rem" }}
          >
            <img
              className="avatar"
              src={article?.author.image || "https://i.pravatar.cc/50"}
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
          <Editor
            editorState={editorState}
            readOnly={true}
            onChange={() => {}}
          />
        </div>
      </div>
    </>
  );
}

export default observer(Read);
