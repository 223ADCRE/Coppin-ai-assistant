const LoadingBubble = () => {
  return (
    <div className="loading-row">
      <div className="avatar ai">E</div>
      <div className="thinking-bubble">
        <span className="thinking-label">AI is thinking</span>
        <div className="dot-pulse">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

export default LoadingBubble;
