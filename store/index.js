export const state = () => ({
    tipTotal: null,
    total: null,
    amountPerPerson: null
})

export const getters = {
    tipTotal(state) {
        return state.tipTotal
    },
}

export const mutations = {
    TIP_TOTAL(state, tipTotal) {
        state.tipTotal = tipTotal
    },

}

export const actions = {
    totalTip({ commit }, tipTotal) {
        commit('TIP_TOTAL', tipTotal)
    },
}