import { ChangeEvent, useState } from "react";
import { CgInfo } from "react-icons/cg";
import { useAuth } from "@/auth/authContext";
import Image from "next/image";
import TextArea from "@/components/TextArea";
import Markdown from "react-markdown";
import Lottie from "lottie-react";
import Animation from "../../public/animation.json";
import { BsStars } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
const Chat = (props: any) => {
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [generatingOutput, setGeneratingOutput] = useState(false);
  const abortController = new AbortController();

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmitButton = async () => {
    if (content.length < 1) return;
    setOutput("");
    setIsLoading(true);
    setGeneratingOutput(true);
    setInput(content);
    setContent("");
    setErrorMessage("");

    try {
      const response = await fetch(
        `https://62pmd57an7itunvmecqrjjaluu0sslhf.lambda-url.us-east-1.on.aws/?query=${content}`,
        {
          signal: abortController.signal,
        },
      );
      if (abortController.signal.aborted) {
        console.log("Fetch request aborted");
        return;
      }

      const reader = response.body!.getReader();
      while (true) {
        if (isLoading) {
          console.log("here");
          setIsLoading(false);
        }
        const { done, value } = await reader.read();
        if (done) {
          setGeneratingOutput(false);
          break;
        }

        setOutput((prevState) => prevState + new TextDecoder().decode(value));
      }
    } catch (error) {
      if (abortController.signal.aborted) {
        console.log("Fetch request aborted");
        return;
      }
      setErrorMessage(JSON.stringify(error));
      console.error("Error in API request:", error);
    }
  };

  const abortFetch = () => {
    console.log("Called")
    abortController.abort();
    setOutput("");
    setGeneratingOutput(false);
    setIsLoading(false);
  };

  return (
    <div className="w-full h-screen bg-[#FFF] flex flex-col justify-between pb-8">
      <div className="px-5 py-5 w-full flex justify-between items-center ">
        <div className="text-blue-950 text-[34px] font-bold ">Nfig Chat</div>
        <div className="py-2 px-2 bg-white rounded-[30px] shadow flex items-center">
          <div className="pr-2.5 color-[#718096] cursor-pointer">
            <CgInfo aria-setsize={24} size={24} color="#718096" />
          </div>
          <div>
            {user?.photoURL && (
              <Image
                src={user?.photoURL}
                width={41}
                height={41}
                alt="profile picture"
                className="rounded-full cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
      <div
        id="chat-window"
        className="h-full w-full flex justify-center max-h-[535px] px-5"
        style={{ overflowY: "scroll" }}
      >
        <div className="max-w-[1200px] md:w-[70%] lg:w-[60%] xl:w-[50%] pb-8">
          {input.length > 1 && (
            <div className="flex w-full">
              <div className="w-10 h-9 border border-slate-200 rounded-full flex items-center justify-center">
                <FaUser color="#155EEF" />
              </div>
              <div className="flex w-full">
                <div
                  key={input}
                  className="ml-4  w-full py-6 px-5 rounded-[14px] border border-slate-200 justify-start items-center inline-flex text-blue-950 text-base font-semibold leading-none"
                >
                  {input}
                </div>
              </div>
            </div>
          )}
          {output.length < 2 && isLoading && (
            <div className="flex my-4">
              <div className="w-10 h-9 bg-gradient-to-t from-indigo-700 to-[#155EEF] rounded-full flex items-center justify-center">
                <BsStars color="#FFFFFF" />
              </div>
              <div
                key={output}
                className="ml-4 mb-4  w-full p-5 bg-white rounded-[14px] shadow justify-start items-center text-blue-950 text-sm font-medium leading-normal"
              >
                <div>
                  <Lottie
                    animationData={Animation}
                    loop={true}
                    style={{ height: "80px" }}
                  />
                </div>
              </div>
            </div>
          )}
          {output.length > 1 && (
            <div className="flex my-4">
              <div className="w-10 h-9 bg-gradient-to-t from-indigo-700 to-[#155EEF] rounded-full flex items-center justify-center">
                <BsStars color="#FFFFFF" />
              </div>
              <div
                key={output}
                className="ml-4 mb-4  w-full p-5 bg-white rounded-[14px] shadow justify-start items-center text-blue-950 text-sm font-medium leading-normal"
              >
                <Markdown>{output}</Markdown>
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="w-full py-6 px-5 rounded-[14px] border border-slate-200 justify-start items-center inline-flex text-red-700 text-base font-semibold leading-none">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
      <div className="px-5 py-5 w-full flex items-center flex-col">
        <div className="flex w-full items-center justify-center">
          <TextArea
            handleInputChange={handleInputChange}
            content={content}
            handleSubmitButton={handleSubmitButton}
            generatingOutput={generatingOutput}
            abortFetch={abortFetch}
          />
        </div>
        <div className="w-full text-center mt-3">
          <span className="text-slate-500 text-xs font-medium font-['Plus Jakarta Sans'] leading-3">
            Nfig chat may produce inaccurate information about people, places,
            or facts.
          </span>
          <span className="text-indigo-950 text-xs font-medium font-['Plus Jakarta Sans'] underline leading-3">
            Nfig chat with GPT-4 model
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
