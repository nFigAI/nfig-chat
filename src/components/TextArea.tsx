import { ChangeEvent, useState } from "react";
import { BiDownArrowAlt } from "react-icons/bi";
import { FaStop } from "react-icons/fa";

export default function TextArea({
  handleInputChange,
  content,
  handleSubmitButton,
  generatingOutput,
  abortFetch,
}: {
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  content: string;
  handleSubmitButton: () => void;
  generatingOutput: boolean;
  abortFetch: () => void;
}) {
  // const [content, setContent] = useState("");
  const [focused, setFocus] = useState(false);

  // const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
  //   setContent(e.target.value);
  // };

  const handleFocusChange = () => {
    setFocus((prevState) => !prevState);
  };

  const calculateTextareaHeight = () => {
    const rows = content.split("\n").length;
    const minHeight = 54;
    const calculatedHeight = Math.max(minHeight, rows * 20);

    return calculatedHeight + "px";
  };
  return (
    <div className="relative w-full max-w-[940px] md:w-[70%] lg:w-[60%] xl:w-[50%] ">
      <textarea
        style={{ height: calculateTextareaHeight() }}
        onChange={handleInputChange}
        onFocus={handleFocusChange}
        onBlur={handleFocusChange}
        value={content}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            handleSubmitButton();
          }
        }}
        className={`transition-all duration-100 ease-in-out max-h-[200px] pl-4 md:pl-5 py-[15px] w-full h-full ${
          focused ? "border border-blue-950" : "border border-slate-200"
        } outline-none resize-none text-slate-500 text-xs md:text-sm font-medium leading-[14px] rounded-[12px] bg-transparent`}
        placeholder="Send a message"
      />
      <button
        onClick={generatingOutput ? abortFetch : handleSubmitButton}
        disabled={
          generatingOutput ? false : content.length < 1 || generatingOutput
        }
        className="transition-all duration-200 ease-in-out disabled:bg-gray-500 absolute bottom-4 right-2 text-white color-white rounded-[100px] flex items-center justify-center bg-[#155EEF] rotate-180 w-[32px] h-[32px]"
      >
        {generatingOutput ? <FaStop size={12} /> : <BiDownArrowAlt size={24} />}
      </button>
    </div>
  );
}
