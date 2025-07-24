import { useRef } from "react";
import "../css files/select.css";
import PropTypes from "prop-types";
export default function Select({ cities, updateCity, darkMode }) {
  const selected = useRef();
  const optionContainer = useRef();
  function handleOptioncontainerClicked() {
    optionContainer.current.classList.toggle("active");
  }
  function handleOptionClicked(e, index) {
    updateCity(cities[index]);
  }
  return (
    <>
      <div
        className="select-box"
        ref={selected}
        onClick={handleOptioncontainerClicked}
      >
        <div
          className={darkMode ? "options-container dark" : "options-container"}
          ref={optionContainer}
          key={"ali ibrahim"}
        >
          {cities.map((city, index) => {
            return (
              <div
                className="option"
                key={index}
                onClick={(e) => {
                  handleOptionClicked(e, index);
                }}
              >
                {city.arabicCityName}
              </div>
            );
          })}
        </div>
        <div className={darkMode ? "selected dark" : "selected"}>
          اختر المدينة
        </div>
      </div>
    </>
  );
}
Select.propTypes = {
  cities: PropTypes.array.isRequired,
  updateCity: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};
