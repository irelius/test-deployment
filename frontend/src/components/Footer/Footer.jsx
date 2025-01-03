import { FaLinkedin, FaGithub } from "react-icons/fa";
import foot from "./footer.module.css";

function Footer() {
  return (
    <div className={foot.mainContainer}>
      <a
        className={foot.linkButtonContainer}
        href="https://www.linkedin.com/in/alexgwright2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className={foot.linkedin}>
          <FaLinkedin size={30} />
        </button>
      </a>
      <a
        className={foot.linkButtonContainer}
        href="https://github.com/awright222"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className={foot.github}>
          <FaGithub size={30} />
        </button>
      </a>
    </div>
  );
}

export default Footer;