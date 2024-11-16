
import React, {useState} from "react";;
import FilterSidebar from "./FilterSidebar.jsx";

function MainPage() {
    const [isShowing, setIsShowing] = useState(false);

    return (
        <main className="main-content">
            <FilterSidebar isShowing={isShowing} />
        </main>
    );
}

export default MainPage;
