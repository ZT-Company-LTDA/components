import React from "react";

import {
  useEditor,
  EditorContent,
  Editor,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TypographyExtension from "@tiptap/extension-typography";
import UnderlineExtension from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Dropcursor from "@tiptap/extension-dropcursor";
import Link from "@tiptap/extension-link";
import Code from "@tiptap/extension-code";
import TextAlign from "@tiptap/extension-text-align";
import { common, createLowlight } from 'lowlight';
import Heading from '@tiptap/extension-heading'
import { ColorHighlighter } from "./ColourHighlighter";
import { SmilieReplacer } from "./SmilieReplacer";

import { styled } from "@mui/material/styles";

import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import ProjectCreateContentToolbar from "./Toolbar";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";

export default function EditorComponent({
  content,
  onCloseModal,
  onSave
}: {
  content: string;
  onCloseModal?:()=>void;
  onSave: (newContent:string) => void;
}) {
  const [isEditable, setIsEditable] = React.useState(!onSave)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph:false,
        document:false,
        text:false,
        dropcursor:false,
        code:false,
        codeBlock:false,
        heading:false
      }),
      Highlight,
      TypographyExtension,
      UnderlineExtension,
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels:[1,2,3]
      }),
      Dropcursor,
      Code,
      Link,
      CodeBlockLowlight.configure({
        lowlight: createLowlight(common)
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ColorHighlighter,
      SmilieReplacer,
    ],
    content: content,
    editorProps: {
      attributes:{
        class:  'prose prose-h1:text-4xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h3:text-xl prose-h3:font-medium text-sm' +
                'prose prose-li:marker:text-black prose-li:marker:text-sm prose-li:my-1 prose-p:my-1' +
                'prose prose-code:rounded-md prose-code:px-1 prose-code:py-1 prose-code:bg-gray-300' +
                'prose prose-sm sm:prose-sm lg:prose-sm xl:prose-sm m-5 h-[100%] min-h-[100%] max-h-[100%] w-[100%] min-w-[100%] break-words overflow-y-auto focus:outline-none'

      }
    },
    immediatelyRender:false,
    editable:isEditable
  });

  const handleEdit = () => {
    if(isEditable && !!onSave){
      if( !editor?.getText() ) return toast.error('Escreva algo para salvar o novo conteudo.')
      onSave(editor.getHTML())
      if(onCloseModal) onCloseModal()
    }
    setIsEditable(!isEditable)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {editor && <ProjectCreateContentToolbar editor={editor} isEditable={isEditable}/>}
      <EditorContent editor={editor} className="w-full h-[80%] flex items-center justify-center bg-white text-black border-1 border-gray-300 rounded-sm p-1 max-h-[80%] mb-2"/>
      {
        !!onSave && 
        <Button onPress={handleEdit} className="w-1/3">
        {!isEditable ? 'Editar' : 'Salvar'}
        </Button>
      }
    </div>
  );
}
