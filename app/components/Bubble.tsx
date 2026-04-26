interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

interface BubbleProps {
  message: Message;
}

const Bubble = ({ message }: BubbleProps) => {
  return (
    <div className={`bubble ${message.role}`}>
      {message.content}
    </div>
  );
};

export default Bubble;