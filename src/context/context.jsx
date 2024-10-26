import { useEffect, useContext, createContext, useReducer } from "react";
import reducer from "../reducer/reducer";
import { defaultState } from "../reducer/defaultState";
import {
  SHOW_SIDEBAR,
  HIDE_SIDEBAR,
  SHOW_OVERLAY,
  HIDE_OVERLAY,
  SHOW_CART,
  HIDE_CART,
  READ_SCREENWIDTH,
  INCREASE_AMOUNT,
  DECREASE_AMOUNT,
  REMOVE_ITEM,
  ADD_TO_CART,
  UPDATE_CART,
  GET_TOTAL_CART,
} from "../reducer/actions";

const AppContext = createContext();

const AppProvider = (x) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const toggle = (type) => () => dispatch({ type });
  const modifyAmount = (type) => (id) => dispatch({ type, payload: { id } });

  const addToCart = (amount, item) => {
    if (amount) {
      dispatch({ type: ADD_TO_CART, payload: { item, amount } });
    }
  };

  const readScreenWidth = () => {
    dispatch({ type: READ_SCREENWIDTH, payload: window.innerWidth });
  };

  useEffect(() => {
    dispatch({ type: GET_TOTAL_CART });
  }, [state.amount, state.cart]);

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
            showCart: toggle(SHOW_CART),
            hideCart: toggle(HIDE_CART),
            increaseAmount: modifyAmount(INCREASE_AMOUNT),
            decreaseAmount: modifyAmount(DECREASE_AMOUNT),
            addToCart,
            updateCart: toggle(UPDATE_CART),
            removeItem: modifyAmount(REMOVE_ITEM),
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
