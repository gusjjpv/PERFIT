import type { TokenUser } from "../types"

export const setItemInLocalStorage = (accessToken ?: string, refreshToken ?: string, userData ?: TokenUser) => {
    if(accessToken) {
        localStorage.setItem('access', accessToken)
    }

    if(refreshToken) {
        localStorage.setItem('refresh', refreshToken)
    }

    if(userData && typeof userData === 'object') {
        localStorage.setItem('user', JSON.stringify(userData))
    }
}

export const getAccessTokenInLocalStorage = () => localStorage.getItem('access')

export const getRefreshTokenInLocalStorage = () => localStorage.getItem('refresh')

export const getUserDataInLocaStorage = () => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
}

export const cleanLocalStorage = () => {
    localStorage.clear()
}