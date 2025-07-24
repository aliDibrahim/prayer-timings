import "../css files/loading.css";

export default function Loading({ darkMode }) {
  return (
    <div className={darkMode ? "bouncing-dots dark" : "bouncing-dots light"}>
      <div className="dot dot-1"></div>
      <div className="dot dot-2"></div>
      <div className="dot dot-3"></div>
    </div>
  );
}
