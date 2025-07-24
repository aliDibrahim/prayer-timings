import PropTypes from "prop-types";
import "../css files/prayerCard.css";
export default function MultiActionAreaCard({
  time,
  name,
  darkMode,
  iconPlace,
}) {
  return (
    <div className={darkMode ? "card dark" : "card light"}>
      <p className="name">{time}</p>
      <div className={iconPlace}></div>
      <p className="time">{name}</p>
    </div>
  );
}

MultiActionAreaCard.propTypes = {
  time: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
