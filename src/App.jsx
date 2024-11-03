import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Main } from "./layout/index";
import { useGlobalContext } from "./context/context";
import Footer from "./layout/element/Footer.jsx";
import Header from "./layout/element/Header.jsx";
import MainPage from "./components/components/MainPage.jsx";
import ScrollToTopButton from "./components/components/ScrollToTopButton.jsx";



function App() {
    const { state } = useGlobalContext();

    return (
        <Router>
            <div className="App">
                <Header />
                <div className="content">

                    <Routes>
                        <Route path="/item/:id" element={<Main />} />
                        <Route path="/" element={<MainPage />} />
                    </Routes>
                </div>
                <ScrollToTopButton />
                <Footer />
            </div>
        </Router>
    );
}
// <Sidebar2 isShowing={state.showSidebar} />
export default App;
