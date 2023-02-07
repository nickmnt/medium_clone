// @ts-nocheck
import React, { useEffect } from "react";
import { Article } from "../../app/models/article";
import { convertFromRaw } from "draft-js";
import "./articleCard.css";
import { useNavigate } from "react-router-dom";
const JDate = require("jalali-date");

interface Props {
  article: Article;
}

function ArticleCard({ article }: Props) {
  const date = new Date(article.createdAt);
  const jdate = JDate.toJalali(date);
  const navigate = useNavigate();

  return (
    <article className="article-card">
      <div className="article-card-header">
        <div className="author-box">
          <img
            className="avatar"
            src={article.author.image || "https://i.pravatar.cc/50"}
            alt="user avatar"
          />
          <div className="author-info">
            <div>
              <p className="author-name">{article.author.displayName}</p>
              <span className="bullet"></span>
              <p className="article-date">{`${jdate[0].toLocaleString("fa-IR", {
                useGrouping: false,
              })}/${jdate[1].toLocaleString("fa-IR")}/${jdate[2].toLocaleString(
                "fa-IR"
              )} - ${date.getHours().toLocaleString("fa-IR", {
                minimumIntegerDigits: 2,
              })}:${date.getMinutes().toLocaleString("fa-IR", {
                minimumIntegerDigits: 2,
              })}:${date.getSeconds().toLocaleString("fa-IR", {
                minimumIntegerDigits: 2,
              })}`}</p>
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
        <img src={`https://localhost:7190/${article.image}`} alt="image" />
      </div>

      <span className="pill">{article.category.name}</span>
    </article>
  );
}

export default ArticleCard;
