import "../css files/footer.css";
import Logo from "../../public/images/logo.png";

export default function Footer({ darkMode }) {
  return (
    <footer className={darkMode ? "footer dark" : "footer light"}>
      <img src={Logo} alt="logo" />
      <div className="footer-content">
        <h3>Prayer Timings</h3>
        <p>
          Stay spiritually connected. Accurate daily prayer times for your city.
        </p>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Ali Dirar Ibrahim Dev. All rights reserved.</p>
      </div>
    </footer>
  );
}
