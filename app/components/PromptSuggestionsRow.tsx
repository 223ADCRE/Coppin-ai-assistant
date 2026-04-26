import PromptSuggestionButton from "./PromptSuggestionButton";

/**
 * Props for the suggestion row
 * onPromptClick → function passed from parent (page.tsx)
 */
interface PromptSuggestionsRowProps {
  onPromptClick: (prompt: string) => void;
}

/**
 * List of starter prompts shown when chat is empty
 * Designed to guide users into meaningful queries (important for RAG quality)
 */
const PROMPTS: string[] = [
  "What are the admission requirements?",
  "Tell me about Coppin State programs",
  "How do I apply for financial aid?",
  "What is student life like at Coppin?",
  "Are there online courses available?",
  "How can I reset my student portal password?",
];

/**
 * PromptSuggestionsRow Component
 * Displays clickable suggestion buttons
 */
const PromptSuggestionsRow = ({ onPromptClick }: PromptSuggestionsRowProps) => {
  return (
    <div className="prompt-suggestions-row">
      {PROMPTS.map((prompt) => (
        <PromptSuggestionButton
          key={prompt} // ✅ better than index (stable + unique)
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionsRow;