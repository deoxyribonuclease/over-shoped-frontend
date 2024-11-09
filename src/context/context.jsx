import { useEffect, useContext, createContext, useReducer } from "react";
import reducer from "../reducer/reducer";
import { defaultState } from "../reducer/defaultState";
import {
    SHOW_SIDEBAR,
    HIDE_SIDEBAR,
    SHOW_OVERLAY,
    HIDE_OVERLAY,
    READ_SCREENWIDTH,
} from "../reducer/actions";

const AppContext = createContext();

const AppProvider = (x) => {
    const [state, dispatch] = useReducer(reducer, defaultState);

    const toggle = (type) => () => dispatch({ type });

    const readScreenWidth = () => {
        dispatch({ type: READ_SCREENWIDTH, payload: window.innerWidth });
    };

    useEffect(() => {
        window.addEventListener("resize", readScreenWidth);
        if (state.screenWidth < 768 && state.showingOverlay) {
            dispatch({ type: HIDE_OVERLAY });
        }
        if (state.screenWidth > 768 && state.showSidebar) {
            dispatch({ type: HIDE_SIDEBAR });
        }

        return () => window.removeEventListener("resize", readScreenWidth);
    }, [state.screenWidth]);

    return (
        <AppContext.Provider
            value={{
                state,
                showSidebar: toggle(SHOW_SIDEBAR),
                hideSidebar: toggle(HIDE_SIDEBAR),
                showImageOverlay: toggle(SHOW_OVERLAY),
                hideImageOverlay: toggle(HIDE_OVERLAY),
            }}
        >
            {x.children}
        </AppContext.Provider>
    );
};

const useGlobalContext = () => {
    return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
