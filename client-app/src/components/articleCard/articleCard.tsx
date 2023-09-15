// @ts-nocheck
import React, { useEffect } from "react";
import { Article } from "../../app/models/article";
import { convertFromRaw } from "draft-js";
import "./articleCard.css";
import { useNavigate } from "react-router-dom";
import { format } from "../../urils/jdate";

interface Props {
  article: Article;
}

function ArticleCard({ article }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (article.id === 3) {
      console.log(article.body?.slice(15773));
    }
  }, []);

  return (
    <article className="article-card">
      <div className="article-card-header">
        <div className="author-box">
          <img
            className="avatar"
            src={
              article.author.image
                ? `https://localhost:5000/${article.author.image}`
                : "https://api.dicebear.com/5.x/thumbs/svg"
            }
            alt="user avatar"
          />
          <div className="author-info">
            <div>
              <p className="author-name">{article.author.displayName}</p>
              <span className="bullet"></span>
              <p className="article-date">{format(article.createdAt)}</p>
            </div>
            <p className="author-bio">{article.author.bio}</p>
          </div>
        </div>
      </div>

      <div className="article-content">
        <div className="main-article-content">
          <h2
            onClick={() => navigate(`/read/${article.id}`)}
            className="article-title"
          >
            {article.title}
          </h2>

          <div className="article-card-body">
            {convertFromRaw(JSON.parse(article.body))
              .getBlocksAsArray()
              .find((cb) => cb.getType() === "unstyled")
              ?.getText()}
          </div>
        </div>
        <img src={`https://localhost:5000/${article.image}`} alt="image" />
      </div>

      <span className="pill">{article.category.name}</span>
    </article>
  );
}

export default ArticleCard;
