
//reducer
function reducers1(store=0,action){
    switch (action.type) {
        case 'increment':
            return store+1;
            break;
        default:
            return store;
    }
}

function reducers2(store=0,action){
    switch (action.type) {
        case 'desrement':
            return store-1;
            break;
        default:
            return store;
    }
}

export {reducers1,reducers2};
