
const gameReducer = (state, action) => {
    switch (action.type) {
        case "GET_CARDS":
            return {
                ...state,
                cards: ['socio', 'perro']
            }
        default:
            throw Error('Unknown action: ' + action.type);
    }
}

export default gameReducer