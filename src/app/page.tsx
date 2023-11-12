"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useCompletion } from "ai/react";
import { PromptInput } from "@/components/PromptInput";

export default function Home() {
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/qa-openai",
    onFinish: (_prompt, answer) => {
      setMessages((prevMessages) => {
        const [first, ...other] = prevMessages;
        return [[answer, first[0]], ...other];
      });
    },
  });
  const [messages, setMessages] = useState<Array<string[]>>([]);

  const onPromptSubmit = (prompt: string) => {
    setMessages((prevMessages) => [[prompt], ...prevMessages]);
    complete(prompt);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />

      <div className="flex flex-col w-full min-h-screen h-full bg-gray-900 pt-[100px]">
        <div className="container mx-auto">
          <PromptInput
            disabled={isLoading}
            onSubmit={(prompt) => onPromptSubmit(prompt)}
          />

          {!!messages.length && (
            <div className="messages whitespace-pre-wrap rounded-b-md min-h-[40px] mb-[20px] bg-gray-800 p-4 mb-5">
              <div className="flex items-center mb-4">
                <button
                  className="ml-auto bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-4 rounded"
                  onClick={clearMessages}
                >
                  Clear Messages
                </button>
              </div>

              <div>
                {isLoading && !!completion.length && (
                  <div className="message even:bg-gray-500 odd:bg-gray-600 odd:mt-4 text-white p-5">
                    {completion}
                  </div>
                )}

                {messages.map((conversation) => {
                  return conversation.map((message) => (
                    <div
                      key={message}
                      className="message whitespace-pre-wrap even:bg-gray-500 odd:bg-gray-600 odd:mt-4 text-white p-5"
                    >
                      {message}
                    </div>
                  ));
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
