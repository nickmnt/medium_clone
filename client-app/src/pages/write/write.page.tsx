import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { useStore } from "../../app/stores/store";
import Editor from "../../components/editor/editor";

function Write() {
  const { id } = useParams();
  const {
    contentStore: { articles },
  } = useStore();
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [file, setFile] = useState([]);
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState<{ label: string; value: string } | null>(null);
  const [publishing, setPublishing] = useState(false);

  async function onPublish() {
    setPublishing(true);

    try {
      if (id) {
        await agent.requests.put(`/Articles?articleId=${id}`, {
          title: title,
          body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          categoryId: cat?.value,
        });

        if (file.length > 0) {
          const formData = new FormData();
          formData.append("File", file[0]);
          await agent.requests.put(`/Photos/article?articleId=${id}`, formData);
        }

        toast("مقاله با موفقیت ویرایش شد", {
          type: "success",
        });

        navigate("/");
      } else {
        await agent.requests.post(`/Articles?articleId=${id}`, {
          title: title,
          body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          categoryId: cat?.value,
        });

        toast("مقاله با موفقیت منتشر شد", {
          type: "success",
        });

        navigate("/");
      }
    } catch (error) {
      setPublishing(false);

      toast("خطایی رخ داد", {
        type: "error",
      });
    }
  }

  useEffect(() => {
    if (!id) return;

    const article = articles.find((a) => a.id === +id);

    if (article) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(article.body || ""))
        )
      );
      setTitle(article.title || "");
      setCat({ label: article.category.name, value: article.category.id });
      return;
    }

    navigate("/");
  }, []);

  return (
    <Editor
      editorState={editorState}
      onChangeState={setEditorState}
      onPublish={onPublish}
      publishing={publishing}
      title={title}
      onChangeTitle={setTitle}
      cat={cat}
      onChangeCat={setCat}
      file={file}
      setFile={setFile}
      fileRequired={id == null}
    />
  );
}

export default observer(Write);
