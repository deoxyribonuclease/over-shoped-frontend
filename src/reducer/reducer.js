const reducer = (state, action) => {
  switch (action.type) {
    case "SHOW_SIDEBAR":
      return { ...state, showSidebar: true }
    case "HIDE_SIDEBAR":
      return { ...state, showSidebar: false }
    case "SHOW_OVERLAY":
      if (state.screenWidth < 769) return state
      return { ...state, showingOverlay: true }
    case "HIDE_OVERLAY":
      return { ...state, showingOverlay: false }
    case "READ_SCREENWIDTH":
      return { ...state, screenWidth: action.payload }
    default:
      return state
  }
}

export default reducer
