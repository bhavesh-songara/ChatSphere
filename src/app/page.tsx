"use client";

import { Circle } from "lucide-react";
import { useChatBot } from "./hooks/useChatBot";

export default function Home() {
  const { isListening, stopListening, startListening } = useChatBot();
  return (
    <div className="">
      <section className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <section className="cursor-pointer">
          {isListening ? (
            <div onClick={stopListening}>
              <Circle size={48} /> Listening...
            </div>
          ) : (
            <Circle size={48} onClick={startListening} />
          )}
        </section>
      </section>
    </div>
  );
}
