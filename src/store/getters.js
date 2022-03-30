const getters = {
    sidebar: state => state.app.sidebar,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    userInfo: state => state.user.userInfo,
    routerNames: state => state.user.routerNames,
}
export default getters
