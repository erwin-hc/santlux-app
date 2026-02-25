// components/MessageDisplay.tsx
"use client";
import { useMessages } from "@/providers/MessageProvider";
import { motion, AnimatePresence } from "framer-motion";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon } from "lucide-react";

const MessageDisplay: React.FC = () => {
  const { messages, removeMessage } = useMessages();

  const messageTypes = {
    icons: {
      success: <CircleCheckIcon className="size-4" />,
      error: <OctagonXIcon className="size-4" />,
      info: <InfoIcon className="size-4" />,
      warning: <TriangleAlertIcon className="size-4" />,
    },
    styles: {
      success: `border-emerald-500 
                bg-[#e5f8f2] 
                text-emerald-600 
                border-0 
                border-l-6 
                dark:text-emerald-400
                dark:bg-[#081b15]`,
      error: `border-destructive 
              bg-[#fdecec] 
              text-destructive 
              border-0 
              border-l-6 
              dark:text-red-400
              dark:bg-[#150b0b]`,
      info: `border-blue-500 
             bg-[#e9f2ff] 
             text-blue-600 
             border-0 
             border-l-6 
             dark:text-blue-400
             dark:bg-[#0c1522]`,
      warning: `border-amber-500 
                bg-[#fff5e5] 
                text-amber-600 
                border-0 
                border-l-6 
                dark:text-amber-400
                dark:bg-[#221808]`,
    },
  };

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, paddingLeft: "18px" }}>
      <AnimatePresence>
        {messages.map((message) => {
          return (
            <motion.div
              key={message.id}
              // Apply basic styles based on message type
              className={messageTypes.styles[message.type]}
              style={{
                padding: "10px 20px",
                marginBottom: 10,
                cursor: "pointer",
                borderRadius: "4px",
              }}
              onClick={() => removeMessage(message.id)}
              layout // Faz com que os outros itens deslizem suavemente quando um é removido
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-3">
                <span>{messageTypes.icons[message.type]}</span>
                <span className="">{message.text}</span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default MessageDisplay;
