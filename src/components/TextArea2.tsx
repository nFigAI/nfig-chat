import { ChangeEvent } from "react";

export default function TextArea({handleInputChange,content}:{
  content:string;
  handleInputChange:(e:ChangeEvent<HTMLTextAreaElement>)=>void
}) {

  const calculateTextareaHeight = () => {
    const rows = content.split("\n").length;
    const minHeight = 54;
    const calculatedHeight = Math.max(minHeight, rows * 20);

    return calculatedHeight + "px";
  };
  return (
    <textarea
      style={{ height: calculateTextareaHeight() }}
      onChange={handleInputChange}
      value={content}
      className="max-w-[738px] md:w-[70%] lg:w-[60%] xl:w-[50%] max-h-[200px] pl-4 md:pl-5 py-[15px] w-full h-full border border-slate-200 outline-none resize-none text-slate-500 text-xs md:text-sm font-medium leading-[14px] rounded-[45px] bg-transparent"
      placeholder="Send a message"
    />
  );
}
