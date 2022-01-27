const init_state = {
    cartData = []
}

const reducer = (state = init_state, action) => {
    switch (action.type) {
        case "GET_CART":
            return {...state, cartData : action.payload}    
        default:
            return state;
    }
}