import { cleanLocalStorage, getRefreshTokenInLocalStorage } from "../storage/LocalStorage"
import type { TokenUser } from "../types"

export async function handleLogin(username: string, password: string) {
  try {
    const response = await fetch('http://34.200.36.243/api/token/', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.log("Internal error: ", error)
  }
}

export async function refreshAccessToken(
  setUser?: React.Dispatch<React.SetStateAction<TokenUser | null>>
): Promise<string | null> {

  const refreshToken = getRefreshTokenInLocalStorage()
  if (!refreshToken) return null

  try {
    const response = await fetch("http://34.200.36.243/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      console.error("Erro ao renovar token:", response.statusText)
      cleanLocalStorage()
      return null
    }

    const data = await response.json()
    const newAccessToken: string = data.access

    localStorage.setItem("access", newAccessToken)

    if (setUser) {
      setUser(prev => ({
        ...prev!,
        access: newAccessToken
      }))
    }

    return newAccessToken

  } catch (error) {
    console.error("Erro ao renovar token:", error)
    return null
  }
}
