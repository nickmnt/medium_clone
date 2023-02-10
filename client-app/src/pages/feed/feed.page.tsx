import React, { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";
import "./feed.page.css";
import { observer } from "mobx-react-lite";
import { Category } from "../../app/models/category";
import Select from "react-select";
import ArticleCard from "../../components/articleCard/articleCard";
import SelectedAuthors from "./selectedAuthors/selectedAuthors";
import axios, { CancelTokenSource } from "axios";
import SavedArticles from "./savedArticles/savedArticles";

const sortOptions = [
  { label: "جدیدترین", value: "new" },
  { label: "بهترین", value: "best" },
];

function Feed() {
  let token: CancelTokenSource;
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>(sortOptions[0].value);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [inTitle, setInTitle] = useState(true);
  const [inBody, setInBody] = useState(false);
  const [inAuthor, setInAuthor] = useState(false);

  const {
    contentStore: {
      categories,
      getCategories,
      articles,
      getArticles,
      queryArticles,
    },
    userStore: { user },
  } = useStore();

  useEffect(() => {
    getCategories();
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
      getArticles(
        selectedCategory ? selectedCategory.name : "",
        sortOption === "new",
        sortOption === "best",
        token.token
      );
    }
  }, [query, sortOption, selectedCategory, inTitle, inBody, inAuthor]);

  return (
    <section className="main">
      <aside className="side-box">
        {user ? <SavedArticles /> : null}
        <SelectedAuthors />
      </aside>

      <section className="articles-box">
        <div className="articles-top">
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
          <span style={{ margin: "0 2rem 0 1rem" }}>موضوعات داغ:</span>

          {categories.slice(0, 3).map((c) => {
            return (
              <span
                onClick={() => {
                  if (selectedCategory?.id !== c.id) setSelectedCategory(c);
                  else setSelectedCategory(null);
                }}
                key={c.id}
                className={`pill ${
                  selectedCategory?.id === c.id ? "pill-active" : null
                }`}
              >
                {c.name}
              </span>
            );
          })}
        </div>

        <div className="articles-main">
          <div className="articles-main-top">
            <h3>مقالات</h3>

            <Select
              className="sort-select"
              classNamePrefix="select"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderRadius: "1000px",
                  padding: "0.25rem 0.5rem",
                }),
              }}
              theme={(theme) => ({
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
        </div>

        {articles.map((article) => {
          return <ArticleCard key={article.id} article={article} />;
        })}
      </section>
    </section>
  );
}

export default observer(Feed);
