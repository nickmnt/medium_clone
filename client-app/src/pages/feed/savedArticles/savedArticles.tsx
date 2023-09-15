import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import "./savedArticles.css";

function SavedArticles() {
  const {
    contentStore: { savedArticles, getSavedArticles },
  } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    getSavedArticles();
  }, []);

  function trun(str: string) {
    if (str.length <= 20) {
      return str;
    }
    return str.substring(0, 20) + "...";
  }

  return (
    <section style={{ direction: "rtl", marginBottom: "2rem" }}>
      <h3>لیست خواندنی های من</h3>
      {savedArticles.map((article) => {
        return (
          <div
            key={article.id}
            className="author-box"
            style={{ marginBottom: "1rem" }}
          >
            <img
              className="avatar article-avatar"
              src={article.image ? `https://localhost:5000/${article.image}` : "https://api.dicebear.com/5.x/thumbs/svg"}
              alt="user avatar"
            />
            <div className="author-info">
              <div>
                <p
                  onClick={() => navigate(`/read/${article.id}`)}
                  className="author-name"
                  style={{ cursor: "pointer" }}
                >
                  {trun(article.title || "")}
                </p>
              </div>
              <p className="author-bio">{article.author.displayName}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default observer(SavedArticles);
