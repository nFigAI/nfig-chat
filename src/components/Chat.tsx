import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@/auth/authContext";
import Image from "next/image";
import TextArea from "@/components/TextArea";
import Markdown from "react-markdown";
import Lottie from "lottie-react";
import Animation from "../../public/animation.json";
import { BsStars } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { generateUniqueId } from "@/utils/uid";
import { RiChat1Line } from "react-icons/ri";

interface ConversationInterface {
  role: "system" | "user";
  content: string;
  type: "message" | "error";
}
const Chat = () => {
  const { user, signOut } = useAuth();
  const [uid, setUid] = useState("");
  const [conversation, setConversation] = useState<ConversationInterface[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatingOutput, setGeneratingOutput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortController = new AbortController();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmitButton = async () => {
    if (content.length < 1) return;

    setConversation((prevState) => [
      ...prevState,
      {
        role: "user",
        content: content,
        type: "message",
      },
      {
        role: "system",
        content: "",
        type: "message",
      },
    ]);
    setIsLoading(true);
    setGeneratingOutput(true);

    setContent("");

    try {
      const response = await fetch(
        `https://62pmd57an7itunvmecqrjjaluu0sslhf.lambda-url.us-east-1.on.aws/?query=${encodeURIComponent(
          content,
        )}&session=${encodeURIComponent(uid)}`,
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
          setIsLoading(false);
        }
        const { done, value } = await reader.read();
        if (done) {
          setGeneratingOutput(false);
          break;
        }
        setConversation((prevState) => {
          let temp = [...prevState];
          temp[temp.length - 1].content =
            temp[temp.length - 1].content + new TextDecoder().decode(value);
          return temp;
        });
      }
    } catch (error) {
      if (abortController.signal.aborted) {
        console.log("Fetch request aborted");
        return;
      }
      // @ts-ignore
      const message = error.error_message;

      setConversation((prevState) => [
        ...prevState,
        {
          role: "system",
          content: message ?? "Something went wrong, please try again later",
          type: "error",
        },
      ]);
      console.error("Error in API request:", error);
      setIsLoading(false);
      setGeneratingOutput(false);
    }
  };

  const clearChat = () => {
    setConversation([]);
    setIsLoading(false);
    setGeneratingOutput(false);

    const generatedUid = generateUniqueId();
    setUid(generatedUid);
  };
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);
  useEffect(() => {
    const generatedUid = generateUniqueId();
    setUid(generatedUid);
  }, []);

  const abortFetch = () => {
    console.log("Called");
    abortController.abort();

    setGeneratingOutput(false);
    setIsLoading(false);
  };

  return (
    <div className="w-full h-screen bg-[#FFF] flex flex-col justify-between pb-8">
      <div className="px-5 py-5 w-full flex justify-between items-center ">
        <div className="text-blue-950 text-[34px] font-bold ">Nfig Chat</div>
        <div className="py-2 px-2 bg-white rounded-[30px] shadow flex items-center">
          <div
            className="pr-2.5 color-[#718096] cursor-pointer"
            onClick={() => {
              signOut();
            }}
          >
            <TbLogout aria-setsize={24} size={24} color="#718096" />
          </div>
          <div
            className="pr-2.5 color-[#718096] cursor-pointer"
            onClick={() => {
              clearChat();
            }}
          >
            <RiChat1Line aria-setsize={20} size={20} color="#718096" />
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
          {conversation.map((value, key) => {
            if (value.role === "user" && value.type === "message") {
              return (
                <div key={key} className="flex w-full">
                  <div className="w-10 h-9 border border-slate-200 rounded-full flex items-center justify-center">
                    <FaUser color="#155EEF" />
                  </div>
                  <div className="flex w-full">
                    <div className="ml-4  w-full py-6 px-5 rounded-[14px] border border-slate-200 justify-start items-center inline-flex text-blue-950 text-base font-semibold leading-none">
                      {value.content}
                    </div>
                  </div>
                </div>
              );
            }
            if (
              value.role === "system" &&
              value.type === "message" &&
              value.content.length > 1
            ) {
              return (
                <div key={key} className="flex my-4">
                  <div className="w-10 h-9 bg-gradient-to-t from-indigo-700 to-[#155EEF] rounded-full flex items-center justify-center">
                    <BsStars color="#FFFFFF" />
                  </div>
                  <div className="ml-4 mb-4  w-full p-5 bg-white rounded-[14px] shadow justify-start items-center text-blue-950 text-sm font-medium leading-normal">
                    <Markdown>{value.content}</Markdown>
                  </div>
                </div>
              );
            }
            if (value.role === "system" && value.type === "error") {
              return (
                <div key={key} className="flex my-4">
                  <div className="w-10 h-9 bg-gradient-to-t from-indigo-700 to-[#155EEF] rounded-full flex items-center justify-center">
                    <BsStars color="#FFFFFF" />
                  </div>
                  <div className="ml-4 w-full py-6 px-5 rounded-[14px] border border-slate-200 justify-start items-center inline-flex text-red-700 text-base font-semibold leading-none">
                    {value.content}
                  </div>
                </div>
              );
            }
          })}
          {conversation.length > 1 &&
            conversation[conversation.length - 1].content.length < 2 &&
            isLoading && (
              <div className="flex my-4">
                <div className="w-10 h-9 bg-gradient-to-t from-indigo-700 to-[#155EEF] rounded-full flex items-center justify-center">
                  <BsStars color="#FFFFFF" />
                </div>
                <div className="ml-4 mb-4  w-full p-5 bg-white rounded-[14px] shadow justify-start items-center text-blue-950 text-sm font-medium leading-normal">
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

          <div id="messagesEndRef" ref={messagesEndRef}></div>
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
