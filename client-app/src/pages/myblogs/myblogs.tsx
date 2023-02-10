import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { format } from "../../urils/jdate";
import "./myblogs.css";

function MyBlogs() {
  const {
    contentStore: { articles, getArticles },
    userStore: { user },
  } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div className="container">
      <h1 style={{ width: "100%", textAlign: "center" }}>نوشته های شما</h1>

      <table className="mtable">
        <tbody>
          {articles
            .filter((a) => a.author.username === user?.username)
            .map((article) => {
              return (
                <tr key={article.id}>
                  <td className="tr-img">
                    <img
                      src={article.image ? `https://localhost:7190/${article.image}`: "https://api.dicebear.com/5.x/thumbs/svg"}
                      alt="image"
                    />{" "}
                    <span onClick={() => navigate(`/read/${article.id}`)}>
                      {article.title}
                    </span>
                  </td>
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
                  <td
                    style={{ color: "var(--text-color)", fontWeight: "bold" }}
                  >
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
                  <td>
                    <span
                      className={`pill ${
                        article.isApproved ? "pill-green" : "pill-red"
                      }`}
                    >
                      {article.isApproved ? "تایید شده" : "تایید نشده"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actionbar">
                      <div
                        onClick={() => navigate(`/edit/${article.id}`)}
                        className="table-action action-edit"
                      >
                        <CiEdit fontSize={36} />
                      </div>

                      <div className="table-action action-delete">
                        <CiTrash fontSize={36} />
                        
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default observer(MyBlogs);
