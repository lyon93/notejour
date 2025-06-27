import { useState } from "react";
import EditorWYSIWYG, { Toolbar } from "react-simple-wysiwyg";
import {
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikethrough,
  BtnBulletList,
  BtnNumberList,
  BtnH1,
  BtnH2,
  BtnH3,
  BtnBlockquote,
  Paragraph,
} from "./toolbar/buttons";

export default function Editor({ onValue }) {
  const [value, setValue] = useState("");
  function onChange(e) {
    setValue(e.target.value);
    onValue(e.target.value);
  }
  return (
    <EditorWYSIWYG
    placeholder="Give me your thoughts..."
      className="bg-transparent border-none text-white"
      value={value}
      onChange={onChange}
    >
      <Toolbar className="rsw-toolbar">
        <BtnH1 />
        <BtnH2 />
        <BtnH3 />
        <Paragraph />
        <BtnBold />
        <BtnItalic />
        <BtnUnderline />
        <BtnStrikethrough />
        <BtnBulletList />
        <BtnNumberList />
        <BtnBlockquote />
      </Toolbar>
    </EditorWYSIWYG>
  );
}
