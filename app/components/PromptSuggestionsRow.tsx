interface PromptSuggestionsRowProps {
  onPromptClick: (prompt: string) => void;
}

const CATEGORIES = [
  {
    label: "Admissions",
    prompts: [
      { icon: "📋", text: "What are the admission requirements?" },
      { icon: "📝", text: "How do I apply to Coppin State?" },
    ],
  },
  {
    label: "Programs & Academics",
    prompts: [
      { icon: "🏫", text: "Tell me about Coppin State programs" },
      { icon: "💻", text: "Are there online courses available?" },
    ],
  },
  {
    label: "Financial Aid",
    prompts: [
      { icon: "💵", text: "How do I apply for financial aid?" },
      { icon: "🏆", text: "What scholarships are available?" },
    ],
  },
];

const PromptSuggestionsRow = ({ onPromptClick }: PromptSuggestionsRowProps) => {
  return (
    <div className="landing-categories">
      {CATEGORIES.map((cat) => (
        <div key={cat.label} className="category-group">
          <span className="category-label">{cat.label}</span>
          <div className="category-cards">
            {cat.prompts.map(({ icon, text }) => (
              <button
                key={text}
                className="suggestion-card"
                onClick={() => onPromptClick(text)}
              >
                <span className="card-icon">{icon}</span>
                {text}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptSuggestionsRow;
