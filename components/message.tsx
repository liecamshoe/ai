"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { StreamableValue, useStreamableValue } from '@ai-sdk/rsc';
import { Streamdown } from "streamdown";
import { isToolUIPart, getToolName } from "ai";
import type { UIMessage } from "ai";
import { Orders } from "./orders";
import { Tracker } from "./tracker";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        <BotIcon />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          <Streamdown>{text}</Streamdown>
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  parts,
}: {
  role: string;
  parts: UIMessage['parts'];
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-6 w-full">
        {parts.map((part, idx) => {
          if (part.type === "text") {
            if (!part.text) return null;
            return (
              <div key={idx} className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
                <Streamdown>{part.text}</Streamdown>
              </div>
            );
          }

          if (isToolUIPart(part) && part.state === "output-available") {
            const toolName = getToolName(part);
            const output = (part as any).output;
            return (
              <div key={part.toolCallId}>
                {toolName === "listOrders" ? (
                  <Orders orders={output} />
                ) : toolName === "viewTrackingInformation" ? (
                  <Tracker trackingInformation={output} />
                ) : null}
              </div>
            );
          }

          return null;
        })}
      </div>
    </motion.div>
  );
};
