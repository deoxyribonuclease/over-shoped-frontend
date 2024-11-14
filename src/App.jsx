import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Main } from "./layout/index";
import { useGlobalContext } from "./context/context";
import Footer from "./layout/element/Footer.jsx";
import Header from "./layout/element/Header.jsx";
import MainPage from "./components/components/MainPage.jsx";
import ScrollToTopButton from "./components/components/ScrollToTopButton.jsx";
import AddPage from "./layout/element/AddPage.jsx";
import {useState} from "react";
import Modal from "./components/components/Modal.jsx"

function App() {
    const { state } = useGlobalContext();

    const [modalOpen,setModalOpen] = useState(false);

        const openModal = () => {
            setModalOpen(true);
            console.log("Opening modal");
        };

        const handleButtonClick = (value) => {
                setModalOpen(false);
                console.log("Closing modal"); //
            };

    return (
        <Router>
            <div className="App">
                {modalOpen && <Modal
                    onClose={handleButtonClick}>
                </Modal>}
                <Header setModalOpen={openModal}/>
                <div className="content">

                    <Routes>
                        <Route path="/item/:id" element={<Main />} />
                        <Route path="/" element={<MainPage />} />
                        <Route path="/search/contains/:searchText" element={<MainPage />} />
                        <Route path="/open" element={<AddPage />} />
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
