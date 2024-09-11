import React from "react";

import { Editor } from "@tiptap/react";

import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";

import UndoIcon from "@mui/icons-material/Undo";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import RedoIcon from "@mui/icons-material/Redo";
import CodeIcon from "@mui/icons-material/Code";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import ClearIcon from "@mui/icons-material/Clear";
import LayersClearIcon from "@mui/icons-material/LayersClear";
import FormatTextdirectionRToLIcon from "@mui/icons-material/FormatTextdirectionRToL";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import SubscriptIcon from "@mui/icons-material/Subscript";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

import Paper from "@mui/material/Paper";

import ToggleButton from "@mui/material/ToggleButton";
import { Typography, Divider } from "@mui/material";
import HeadingToolbarButtons from "./toolbars/HeadingToolbarButtons";
import StyledToggleButtonGroup from "./StyledToggleButtonGroup";

const ProjectCreateContentToolbar = ({ editor, isEditable }: { editor: Editor, isEditable:boolean }) => {

  if (!editor) {
    return null;
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          flexWrap: "wrap",
          mb: 2,
          position: "sticky",
          top: 10,
          zIndex: 9999,
          overflowY: "auto", // Permite rolagem se os botões excederem o espaço
          maxWidth: "100%", // Garante que o Paper não exceda a largura da tela
        }}
      >
        <StyledToggleButtonGroup size="small" aria-label="text alignment">
          <ToggleButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            selected={editor.isActive({ textAlign: "left" })}
            value="left"
            aria-label="left aligned"
            disabled={!isEditable}
          >
            <FormatAlignLeftIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            selected={editor.isActive({ textAlign: "center" })}
            value="center"
            aria-label="Center aligned"
            disabled={!isEditable}
          >
            <FormatAlignCenterIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            selected={editor.isActive({ textAlign: "right" })}
            value="right"
            aria-label="Right aligned"
            disabled={!isEditable}
          >
            <FormatAlignRightIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            selected={editor.isActive({ textAlign: "justify" })}
            value="justify"
            aria-label="Justify aligned"
            disabled={!isEditable}
          >
            <FormatAlignJustifyIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            selected={editor.isActive("bold")}
            value="bold"
            aria-label="bold"
            disabled={!isEditable}
          >
            <FormatBoldIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            value="italic"
            aria-label="italic"
            selected={editor.isActive("italic")}
            disabled={!isEditable}
          >
            <FormatItalicIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            value="strike"
            aria-label="strike"
            selected={editor.isActive("strike")}
            disabled={!isEditable}
          >
            <FormatStrikethroughIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            value="code"
            aria-label="code"
            selected={editor.isActive("code")}
            disabled={!isEditable}
          >
            <CodeIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            value="highlight"
            aria-label="highlight"
            selected={editor.isActive("highlight")}
            disabled={!isEditable}
          >
            <BorderColorIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            value="blockQuote"
            aria-label="blockQuote"
            selected={editor.isActive("blockQuote")}
            disabled={!isEditable}
          >
            <FormatQuoteIcon />
          </ToggleButton>

        </StyledToggleButtonGroup>

        <StyledToggleButtonGroup size="small" aria-label="text formatting">

          <ToggleButton
            value="h1"
            aria-label="H1 Text"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            selected={editor.isActive("heading", { level: 1 })}
            disabled={!isEditable}
          >
            <Typography fontWeight={900}>H1</Typography>
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            selected={editor.isActive("heading", { level: 2 })}
            value="h2"
            aria-label="H2 Text"
            disabled={!isEditable}
          >
            <Typography fontWeight={800}>H2</Typography>
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            selected={editor.isActive("heading", { level: 3 })}
            value="h3"
            aria-label="H3 Text"
            disabled={!isEditable}
          >
            <Typography fontWeight={800}>H3</Typography>
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            selected={editor.isActive("heading", { level: 4 })}
            value="h4"
            aria-label="H4 Text"
            disabled={!isEditable}
          >
            <Typography fontWeight={700}>H4</Typography>
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            selected={editor.isActive("HorizontalRule")}
            value="HorizontalRule"
            aria-label="HorizontalRule"
            disabled={!isEditable}
          >
            <HorizontalRuleIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            selected={editor.isActive("underline")}
            value="underline"
            aria-label="underline"
            disabled={!isEditable}
          >
            <FormatUnderlinedIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href;
              const url = window.prompt("URL", previousUrl);

              // cancelled
              if (url === null) {
                return;
              }

              // empty
              if (url === "") {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .unsetLink()
                  .run();

                return;
              }

              // update link
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }}
            selected={editor.isActive("link")}
            value="link"
            aria-label="link"
            disabled={!isEditable}
          >
            <LinkIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            value="bullettList"
            aria-label="bullettList"
            selected={editor.isActive("bulletList")}
            disabled={!isEditable}
          >
            <FormatListBulletedIcon />
          </ToggleButton>
          
          <ToggleButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            value="orderedList"
            aria-label="orderedList"
            selected={editor.isActive("orderedList")}
            disabled={!isEditable}
          >
            <FormatListNumberedIcon />
          </ToggleButton>

        </StyledToggleButtonGroup>
        
        <StyledToggleButtonGroup size="small" exclusive aria-label="text alignment">
          <ToggleButton
            onClick={() => editor.chain().focus().undo().run()}
            value="undo"
            aria-label="undo"
            disabled={!isEditable}
          >
            <UndoIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().redo().run()}
            value="redo"
            aria-label="redo"
            disabled={!isEditable}
          >
            <RedoIcon />
          </ToggleButton>

          <ToggleButton
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            value="clear-mark"
            aria-label="clear-mark"
            disabled={!isEditable}
          >
            <LayersClearIcon />
          </ToggleButton>
          
          <ToggleButton
            onClick={() => editor.chain().focus().clearNodes().run()}
            value="clear-node"
            aria-label="clear-node"
            disabled={!isEditable}
          >
            <ClearIcon />
          </ToggleButton>

        </StyledToggleButtonGroup>

      </Paper>
    </>
  );
};

export default ProjectCreateContentToolbar;
