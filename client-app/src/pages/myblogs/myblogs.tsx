import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";
import { Rings } from "react-loader-spinner";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { Article } from "../../app/models/article";
import { useStore } from "../../app/stores/store";
import { format } from "../../urils/jdate";
import "./myblogs.css";

const modalStyles: ReactModal.Styles = {
  content: {
    width: "min(90%, 400px)",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
};

function MyBlogs() {
  const {
    contentStore: { articles, getArticles },
    userStore: { user },
  } = useStore();
  const navigate = useNavigate();
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getArticles();
  }, []);
  
  async function deleteArticle() {
    if (loading) return;

    setLoading(true);

    try {
      await agent.requests.del(`/Articles?articleId=${activeArticle?.id}`);
      setDeleteOpen(false);
      toast("مقاله شما حذف شد", { type: "success" });
      getArticles();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <div className="container">
      <h1 style={{ width: "100%", textAlign: "center" }}>نوشته های شما</h1>

      <div className="scroller">
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

                      <div onClick={() => {
                        setActiveArticle(article);
                        setDeleteOpen(true)
                      }} className="table-action action-delete">
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
    </div>
          <ReactModal
          isOpen={isDeleteOpen}
          onRequestClose={() => setDeleteOpen(false)}
          ariaHideApp={false}
          style={modalStyles}
        >
          <div className="delete-modal">
            <p>
              آیا از حذف <span>{activeArticle?.title}</span> اطمینان دارید؟
            </p>
  
            <div className="modal-actions">
              <button
                onClick={deleteArticle}
                className="modal-action modal-action-red"
              >
                {" "}
                {loading ? (
                  <Rings
                    height="30"
                    width="30"
                    color="white"
                    radius="6"
                    wrapperStyle={{}}
                    visible={true}
                    ariaLabel="rings-loading"
                  />
                ) : (
                  "بله حذف شود"
                )}
              </button>
              <button
                onClick={() => setDeleteOpen(false)}
                className="modal-action"
              >
                خیر لغو شود
              </button>
            </div>
          </div>
        </ReactModal>
        </>
  );
}

export default observer(MyBlogs);
