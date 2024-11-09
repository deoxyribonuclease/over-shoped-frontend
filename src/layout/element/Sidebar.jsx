import { Close } from "../../icons/index.jsx";
import { useGlobalContext } from "../../context/context.jsx";
import "../styles/sidebar.css";

const sideBarLinks = ["Collections", "Men", "Women", "About", "Contact"];

const Sidebar = (x) => {
  const { hideSidebar } = useGlobalContext();

  return (
      <aside className={`sidebar-wrapper ${x.isShowing ? "active" : ""}`}>
        <nav>
          <button onClick={hideSidebar}>
            <Close />
          </button>
          <ul className="sidebar-links">
            {sideBarLinks.map((link, idx) => (
                <li key={idx}>
                  <a onClick={hideSidebar} href="#">
                    {link}
                  </a>
                </li>
            ))}
          </ul>
        </nav>
      </aside>
  );
};

export default Sidebar;
