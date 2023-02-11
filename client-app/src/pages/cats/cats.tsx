import axios, { CancelTokenSource } from "axios";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CiEdit, CiTrash } from "react-icons/ci";
import { Rings } from "react-loader-spinner";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { Article } from "../../app/models/article";
import { Category } from "../../app/models/category";
import { useStore } from "../../app/stores/store";
import { format } from "../../urils/jdate";
import "./cats.css";

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

function Cats() {
  const {
    contentStore: {
      articles,
      getArticles,
      queryArticles,
      categories,
      getCategories,
    },
    userStore: { user },
  } = useStore();
  const navigate = useNavigate();
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<Category>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getArticles();
    getCategories();
  }, []);

  const onSubmit: SubmitHandler<{ name: string }> = async (formValues: {
    name: string;
  }) => {
    if (loading) return;

    setLoading(true);

    try {
      await agent.requests.put("/Categories", {
        name: formValues.name,
        categoryId: activeCat?.id,
      });
      setEditOpen(false);
      toast("ویرایش انجام شد", { type: "success" });
      getCategories();
      getArticles();
    } finally {
      setLoading(false);
    }
  };

  async function deleteCat() {
    if (loading) return;

    setLoading(true);

    try {
      await agent.requests.del("/Categories", {
        categoryId: activeCat?.id,
      });
      setDeleteOpen(false);
      toast("دسته بندی حذف شد", { type: "success" });
      getCategories();
      getArticles();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container">
        <h1 style={{ width: "100%", textAlign: "center" }}>دسته بندی ها</h1>

        <div className="scroller">
          <table className="mtable cat-mtable">
            <tbody>
              {categories.map((cat) => {
                const as = articles.filter((a) => a.category.id === cat.id);
                return (
                  <tr key={cat.id}>
                    <td>
                      <span className="pill">{cat.name}</span>
                    </td>
                    <td
                      style={{ color: "var(--text-color)", fontWeight: "bold" }}
                    >
                      {as.length}{" "}
                      <span
                        style={{
                          fontWeight: "normal",
                          color: "var(--secondary-text-color)",
                        }}
                      >
                        مقاله
                      </span>
                    </td>
                    <td
                      style={{ color: "var(--text-color)", fontWeight: "bold" }}
                    >
                      {as.reduce<number>(
                        (a: number, b: Article) => a + b.likes.length,
                        0
                      )}{" "}
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
                      <div className="table-actionbar">
                        <div
                          onClick={() => {
                            setActiveCat(cat);
                            setEditOpen(true);
                          }}
                          className="table-action action-edit"
                        >
                          <CiEdit fontSize={36} />
                        </div>

                        <div
                          onClick={() => {
                            setActiveCat(cat);
                            setDeleteOpen(true);
                          }}
                          className="table-action action-delete"
                        >
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
        isOpen={isEditOpen}
        onRequestClose={() => setEditOpen(false)}
        ariaHideApp={false}
        style={modalStyles}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="form-title">تغییر نام دسته بندی</p>
          <input
            className={`input ${errors.name ? "error" : ""}`}
            type="text"
            placeholder="نام جدید دسته بندی..."
            {...register("name", { required: true })}
          />

          <button type="submit">
            {loading ? (
              <Rings
                height="40"
                width="40"
                color="white"
                radius="6"
                wrapperStyle={{}}
                visible={true}
                ariaLabel="rings-loading"
              />
            ) : (
              "ثبت"
            )}
          </button>
        </form>
      </ReactModal>
      <ReactModal
        isOpen={isDeleteOpen}
        onRequestClose={() => setDeleteOpen(false)}
        ariaHideApp={false}
        style={modalStyles}
      >
        <div className="delete-modal">
          <p>
            آیا از حذف <span>{activeCat?.name}</span> اطمینان دارید؟
          </p>

          <div className="modal-actions">
            <button
              onClick={deleteCat}
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

export default observer(Cats);
