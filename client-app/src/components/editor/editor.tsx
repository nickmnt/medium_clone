import React, { useEffect } from "react";
import Select from "react-select";
import IconButton from "../../components/iconbutton/iconbutton";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { CiSaveUp2 } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import {
  Editor as Deditor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  ContentBlock,
} from "draft-js";
import "./editor.css";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import ImageDrop from "../imagedrop/imagedrop";

interface Option {
  label: string;
  value: string;
}

interface Props {
  editorState: any;
  onChangeState: (editorState: EditorState) => void;
  onPublish: () => void;
  publishing: boolean;
  title: string;
  onChangeTitle: (title: string) => void;
  cat: Option | null;
  onChangeCat: (option: Option | null) => void;
  file: any;
  setFile: any;
  fileRequired: boolean;
}

const { useState, useRef, useCallback } = React;

function Editor({
  editorState,
  onChangeState: setEditorState,
  onPublish,
  publishing,
  title,
  onChangeTitle: setTitle,
  cat,
  onChangeCat: setCat,
  file,
  setFile,
  fileRequired,
}: Props) {
  const [catLoading, setCatLoading] = useState(false);
  const editor = useRef<any>(null);
  const navigate = useNavigate();
  const {
    contentStore: { categories, getCategories },
  } = useStore();

  useEffect(() => {
    setCatLoading(true);
    getCategories().finally(() => {
      setCatLoading(false);
    });
  }, []);

  const focus = () => {
    if (editor.current) editor.current.focus();
  };

  const handleKeyCommand = useCallback(
    (command: string, editorState: EditorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEditorState(newState);
        return "handled";
      }
      return "not-handled";
    },
    [editorState, setEditorState]
  );

  const mapKeyToEditorCommand = useCallback(
    (e: React.KeyboardEvent<{}>) => {
      switch (e.keyCode) {
        case 9: // TAB
          const newEditorState = RichUtils.onTab(
            e,
            editorState,
            4 /* maxDepth */
          );
          if (newEditorState !== editorState) {
            setEditorState(newEditorState);
          }
          return null;
      }
      return getDefaultKeyBinding(e);
    },
    [editorState, setEditorState]
  );

  const publish = async () => {
    if (publishing) {
      return;
    }

    if (title.length === 0) {
      toast("لطفا عنوان را وارد کنید", {
        type: "error",
      });
      return;
    }

    if (!cat) {
      toast("لطفا دسته بندی را مشخص کنید", {
        type: "error",
      });
      return;
    }

    if (fileRequired && file.length === 0) {
      toast("لطفا عکس برای مقاله انتخاب کنید", {
        type: "error",
      });
      return;
    }

    onPublish();
  };

  // If the user changes block type before entering any text, we can
  // either style the placeholder or hide it. Let's just hide it now.
  let className = "RichEditor-editor";
  var contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== "unstyled") {
      className += " RichEditor-hidePlaceholder";
    }
  }

  return (
    <div className="container">
      <div className="top-header">
        <div className="actions">
          <IconButton
            label="لغو"
            icon={<RxCross1 />}
            onClick={() => navigate("/")}
          />
          <IconButton
            label="انتشار"
            icon={
              publishing ? (
                <TailSpin
                  height="20"
                  width="20"
                  color="var(--primary-color)"
                  radius="6"
                  wrapperStyle={{}}
                  visible={true}
                  ariaLabel="rings-loading"
                />
              ) : (
                <CiSaveUp2 />
              )
            }
            onClick={publish}
          />
        </div>
        <div className="info">
          <Select
            className="basic-single"
            classNamePrefix="select"
            isLoading={catLoading}
            isClearable={true}
            value={cat}
            isRtl={true}
            isSearchable={true}
            name="category"
            placeholder="دسته بندی..."
            options={categories.map((c) => {
              return { value: c.id, label: c.name };
            })}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary: "var(--primary-color)",
              },
            })}
            onChange={(c) => setCat(c)}
          />
          <input
            className="input title-input"
            type="text"
            placeholder="عنوان مطلب"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={(blockType: string) => {
            const newState = RichUtils.toggleBlockType(editorState, blockType);
            setEditorState(newState);
          }}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={(inlineStyle: string) => {
            const newState = RichUtils.toggleInlineStyle(
              editorState,
              inlineStyle
            );
            setEditorState(newState);
          }}
        />
        <div className={className} onClick={focus}>
          <Deditor
            blockStyleFn={(block: ContentBlock) => getBlockStyle(block) || ""}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            onChange={setEditorState}
            placeholder="داستانت رو بگو..."
            ref={editor}
            spellCheck={true}
          />
        </div>
      </div>
      <ImageDrop file={file} setFile={setFile} />
    </div>
  );
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block: ContentBlock) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}

function StyleButton({
  onToggle,
  active,
  label,
  style,
}: {
  onToggle: any;
  active: any;
  label: any;
  style: any;
}) {
  let className = "RichEditor-styleButton";
  if (active) {
    className += " RichEditor-activeButton";
  }

  return (
    <span
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle(style);
      }}
    >
      {label}
    </span>
  );
}

const BLOCK_TYPES = [
  { label: "عنوان ۱", style: "header-one" },
  { label: "عنوان ۲", style: "header-two" },
  { label: "عنوان ۳", style: "header-three" },
  { label: "عنوان ۴", style: "header-four" },
  { label: "عنوان ۵", style: "header-five" },
  { label: "عنوان ۶", style: "header-six" },
  { label: "نقل قول", style: "blockquote" },
  { label: "لیست نامرتب", style: "unordered-list-item" },
  { label: "لیست مرتب", style: "ordered-list-item" },
  { label: "تیکه کد", style: "code-block" },
];

function BlockStyleControls({
  editorState,
  onToggle,
}: {
  editorState: any;
  onToggle: any;
}) {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
}

const INLINE_STYLES = [
  { label: "بولد", style: "BOLD" },
  { label: "ایتالیک", style: "ITALIC" },
  { label: "خط زیر", style: "UNDERLINE" },
  { label: "مونواسپیس", style: "CODE" },
];

function InlineStyleControls({
  editorState,
  onToggle,
}: {
  editorState: any;
  onToggle: any;
}) {
  const currentStyle = editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
}

export default Editor;
