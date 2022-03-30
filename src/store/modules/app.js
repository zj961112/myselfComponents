import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth';

const app = {
    state: {
        sidebar: {
            opened: !+Cookies.get('sidebarStatus')
        },
        uploadUrl: `${process.env.BASE_API}/exclude/uploadImg?token=${getToken()}`
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
            state.sidebar.opened = !state.sidebar.opened
        }
    },
    actions: {
        ToggleSideBar: ({ commit }) => {
            commit('TOGGLE_SIDEBAR')
        }
    }
}

export default app
