"use client";

import { Circle } from "lucide-react";
import { useChatBot } from "./hooks/useChatBot";
import { ThreeDots } from "@/components/common/ThreeDots";
import { Spinner } from "@/components/common/Spinner";

export default function Home() {
  const { isListening, stopListening, startListening, isProcessing, messages } =
    useChatBot();

  return (
    <div className="">
      <section>
        {messages.map((message, index) => {
          return (
            <section
              key={index}
              className={`${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <p>
                {message.role === "user" ? "You" : message.botName || "Bot"}
              </p>
              <p className="text-lg">{message.text}</p>
            </section>
          );
        })}
      </section>

      <section className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        {isProcessing ? (
          <Spinner />
        ) : (
          <section className="cursor-pointer flex items-center h-12">
            {isListening ? (
              <div onClick={stopListening} className="h-full">
                <ThreeDots dotClassName="bg-black" />
              </div>
            ) : (
              <Circle size={48} onClick={startListening} />
            )}
          </section>
        )}
      </section>
    </div>
  );
}
