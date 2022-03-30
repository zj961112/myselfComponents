const tagsView = {
    state: {
        visitedViews: [],
    },
    mutations: {
        ADD_VISITED_VIEWS: (state, view) => {
            if (view.name == 'login' || view.name == 'error') return;
            const index = state.visitedViews.findIndex(v => v.path === view.path);
            view.meta.new = index >= 0 ? false : true;
            if (index >= 0) {
                state.visitedViews[index] = Object.assign(state.visitedViews[index], view);
            } else {
                state.visitedViews.push({
                    name: view.name,
                    path: view.path,
                    query: view.query,
                    title: (view.query.name ? `${view.meta.title}-${view.query.name}` : view.meta.title) || 'no-name',
                })
            }
        },
        DEL_VISITED_VIEWS: (state, view) => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    state.visitedViews.splice(i, 1)
                    break
                }
            }
        }
    },
    actions: {
        addVisitedViews({ commit }, view) {
            commit('ADD_VISITED_VIEWS', view)
        },
        delVisitedViews({ commit, state }, view) {
            return new Promise((resolve) => {
                commit('DEL_VISITED_VIEWS', view)
                resolve([...state.visitedViews])
            })
        },
        /**
         * 删除当前
         * @param {*} param0 
         * @param {*} route 
         */
        delCurrentVisitedViews({ commit, state }, route) {
            const view = state.visitedViews.find(item => item.path === route.path);
            return new Promise((resolve, reject) => {
                if (view) {
                    commit('DEL_VISITED_VIEWS', view)
                    resolve(view)
                } else {
                    reject();
                }
            })
        }
    } 
}

export default tagsView
