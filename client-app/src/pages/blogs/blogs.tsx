import axios, { CancelTokenSource } from "axios";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import agent from "../../app/api/agent";
import { Article } from "../../app/models/article";
import { useStore } from "../../app/stores/store";
import { format } from "../../urils/jdate";
import "./blogs.css";

const sortOptions = [
  { label: "جدیدترین", value: "new" },
  { label: "بهترین", value: "best" },
];

const statusOptions = [
  { label: "تایید", value: "approved" },
  { label: "عدم تایید", value: "unapproved" },
];

function Blogs() {
  const {
    contentStore: { articles, getArticles, queryArticles },
    userStore: { user },
  } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>(sortOptions[0].value);
  // const [selectedCategory, setSelectedCategory] = useState<Category | null>(
  //   null
  // );
  const [inTitle, setInTitle] = useState(true);
  const [inBody, setInBody] = useState(false);
  const [inAuthor, setInAuthor] = useState(false);
  let token: CancelTokenSource;

  useEffect(() => {
    getArticles("", sortOption === "new", sortOption === "best");
  }, []);

  useEffect(() => {
    if (token) {
      token.cancel();
    }
    token = axios.CancelToken.source();

    if (query && query.length > 0) {
      queryArticles({
        titleQuery: inTitle ? query : "",
        bodyQuery: inBody ? query : "",
        authorQuery: inAuthor ? query : "",
        token: token.token,
      });
    } else {
      getArticles("", sortOption === "new", sortOption === "best", token.token);
    }
  }, [query, sortOption, inTitle, inBody, inAuthor]);

  async function changeStatus(a: Article) {
    await agent.requests.put("/Articles/approve", {
      articleId: a.id,
      newIsApproved: !a.isApproved,
    });

    a.isApproved = !a.isApproved;

    if (token) {
      token.cancel();
    }
    token = axios.CancelToken.source();

    if (query && query.length > 0) {
      queryArticles({
        titleQuery: inTitle ? query : "",
        bodyQuery: inBody ? query : "",
        authorQuery: inAuthor ? query : "",
        token: token.token,
      });
    } else {
      getArticles("", sortOption === "new", sortOption === "best", token.token);
    }
  }

  return (
    <div className="container">
      <h1 style={{ width: "100%", textAlign: "center" }}>
        نوشته های نویسندگان
      </h1>
      <div className="articles-top blogs-top">
        <div className="searchbox">
          <input
            className="input query-input"
            type="text"
            placeholder="جست و جو..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <div className="search-actions">
            <input
              checked={inTitle}
              onChange={(e) => setInTitle(e.target.checked)}
              type="checkbox"
              name="inTitle"
              id="inTitle"
            />
            <label htmlFor="inTitle">در عنوان</label>

            <input
              checked={inBody}
              onChange={(e) => setInBody(e.target.checked)}
              type="checkbox"
              name="inBody"
              id="inTitle"
            />
            <label htmlFor="inBody">در متن</label>

            <input
              checked={inAuthor}
              onChange={(e) => setInAuthor(e.target.checked)}
              type="checkbox"
              name="inAuthor"
              id="inTitle"
            />
            <label htmlFor="inAuthor">در نام نویسنده</label>
          </div>
        </div>

        <Select
          className="sort-select"
          classNamePrefix="select"
          styles={{
            control: (baseStyles: any, state: any) => ({
              ...baseStyles,
              borderRadius: "1000px",
              padding: "0.25rem 0.5rem",
            }),
          }}
          theme={(theme: any) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary: "var(--primary-color)",
            },
          })}
          defaultValue={sortOptions[0]}
          isRtl={true}
          name="category"
          options={sortOptions}
          onChange={(c) => setSortOption(c!.value)}
        />
      </div>

      <div className="scroller">
      <table className="mtable blogs-mtable">
        <tbody>
          {articles.map((article) => {
            return (
              <tr key={article.id}>
                <td className="tr-img">
                  <img
                    src={
                      article.image
                        ? `https://localhost:7190/${article.image}`
                        : "https://api.dicebear.com/5.x/thumbs/svg"
                    }
                    alt="image"
                  />{" "}
                  <span onClick={() => navigate(`/read/${article.id}`)}>
                    {article.title}
                  </span>
                </td>
                <td>{article.author.displayName}</td>
                <td>
                  <span className="pill">{article.category.name}</span>
                </td>
                <td
                  style={{
                    color: "var(--secondary-text-color)",
                  }}
                >
                  انتشار در{" "}
                  <span
                    style={{ color: "var(--text-color)", fontWeight: "bold" }}
                  >
                    {format(article.createdAt)}
                  </span>
                </td>
                <td style={{ color: "var(--text-color)", fontWeight: "bold" }}>
                  {article.likes.length}{" "}
                  <span
                    style={{
                      fontWeight: "normal",
                      color: "var(--secondary-text-color)",
                    }}
                  >
                    لایک
                  </span>
                </td>
                <td className="status-box">
                  <Select
                    className="sort-select"
                    classNamePrefix="select"
                    styles={{
                      control: (baseStyles: any, state: any) => ({
                        ...baseStyles,
                        borderRadius: "1000px",
                        padding: "0.25rem 0.1rem",
                      }),
                    }}
                    theme={(theme: any) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary: article.isApproved
                          ? "var(--success-color)"
                          : "var(--danger-color)",
                        neutral0: article.isApproved
                          ? "var(--success-light-color)"
                          : "var(--danger-light-color)",
                        neutral20: article.isApproved
                          ? "var(--success-color)"
                          : "var(--danger-color)",
                      },
                    })}
                    defaultValue={
                      article.isApproved ? statusOptions[0] : statusOptions[1]
                    }
                    isRtl={true}
                    name="category"
                    options={statusOptions}
                    onChange={(c) => changeStatus(article)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default observer(Blogs);
