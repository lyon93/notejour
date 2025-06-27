import {
  TextBolderIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextStrikethroughIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  LinkIcon,
  ImageIcon,
  QuotesIcon,
  CodeIcon,
  TextHOneIcon,
  TextHTwoIcon,
  TextHThreeIcon,
  ParagraphIcon,
} from "@phosphor-icons/react";
import { remove } from "dexie";
import { createButton } from "react-simple-wysiwyg";

// Text formatting
export const BtnBold = createButton(
  "Bold",
  <TextBolderIcon size={16} fill="current" />,
  "bold"
);
export const BtnItalic = createButton(
  "Italic",
  <TextItalicIcon size={16} fill="current" />,
  "italic"
);
export const BtnUnderline = createButton(
  "Underline",
  <TextUnderlineIcon size={16} fill="current" />,
  "underline"
);
export const BtnStrikethrough = createButton(
  "Strikethrough",
  <TextStrikethroughIcon size={16} fill="current" />,
  "strikeThrough"
);

// Lists
export const BtnBulletList = createButton(
  "Bullet List",
  <ListBulletsIcon size={16} fill="current" />,
  "insertUnorderedList"
);
export const BtnNumberList = createButton(
  "Number List",
  <ListNumbersIcon size={16} fill="current" />,
  "insertOrderedList"
);

// Text alignment
export const BtnAlignLeft = createButton(
  "Align Left",
  <TextAlignLeftIcon size={16} fill="current" />,
  "justifyLeft"
);
export const BtnAlignCenter = createButton(
  "Align Center",
  <TextAlignCenterIcon size={16} fill="current" />,
  "justifyCenter"
);
export const BtnAlignRight = createButton(
  "Align Right",
  <TextAlignRightIcon size={16} fill="current" />,
  "justifyRight"
);
export const BtnAlignJustify = createButton(
  "Justify",
  <TextAlignJustifyIcon size={16} fill="current" />,
  "justifyFull"
);

// Media and links
export const BtnLink = createButton(
  "Insert Link",
  <LinkIcon size={16} fill="current" />,
  "createLink"
);
export const BtnImage = createButton(
  "Insert Image",
  <ImageIcon size={16} fill="current" />,
  "insertImage"
);

// Block elements
export const BtnBlockquote = createButton(
  "Blockquote",
  <QuotesIcon size={16} fill="current" />,
  () => {
    document.execCommand("formatBlock", false, "blockquote");
  }
);

// Headings
export const BtnH1 = createButton(
  "Heading 1",
  <TextHOneIcon size={16} fill="current" />,
  () => {
    document.execCommand("formatBlock", false, "h1");
  }
);
export const Paragraph = createButton(
  "Paragraph",
  <ParagraphIcon size={16} fill="current" />,
  () => {
    document.execCommand("formatBlock", false, "p");
  }
);

export const BtnH2 = createButton(
  "Heading 2",
  <TextHTwoIcon size={16} fill="current" />,
  () => {
    document.execCommand("formatBlock", false, "h2");
  }
);

export const BtnH3 = createButton(
  "Heading 3",
  <TextHThreeIcon size={16} fill="current" />,
  () => {
    document.execCommand("formatBlock", false, "h3");
  }
);
