interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

interface BubbleProps {
  message: Message;
}

const Bubble = ({ message }: BubbleProps) => {
  const isUser = message.role === "user";
  return (
    <div className={`message-row ${message.role}`}>
      <div className={`avatar ${isUser ? "user" : "ai"}`}>
        {isUser ? "U" : "E"}
      </div>
      <div className="bubble">{message.content}</div>
    </div>
  );
};

export default Bubble;
