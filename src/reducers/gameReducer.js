
const initialValues = {
    cards: []
}

const gameReducer = async(state, action) => {
    switch (action.type) {
        case "GET_CARDS":
            return {
                ...state,
                cards: ['socio', 'que', 'ledije']
            }
        default:
            throw Error('Unknown action: ' + action.type);
    }
}

export { gameReducer, initialValues }