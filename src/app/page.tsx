"use client";

import { Circle } from "lucide-react";
import { useChatBot } from "./hooks/useChatBot";
import { ThreeDots } from "@/components/common/ThreeDots";
import { Spinner } from "@/components/common/Spinner";

export default function Home() {
  const { isListening, stopListening, startListening, isProcessing } =
    useChatBot();
  return (
    <div className="">
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
