import { cleanLocalStorage, getRefreshTokenInLocalStorage, setItemInLocalStorage } from "../../storage/LocalStorage"
import type { TokenUser } from "../../types"

export async function handleLogin(username: string, password: string) {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          username: username,
          password: password 
        }),
      })

      if(response.ok) {
        const data = await response.json()
        return data
      } else {
        const data = await response.json()
        return data
      }
    } catch(error) {
      console.log("Internal error: ", error)
    }
}

export async function refreshAccessToken(): Promise<TokenUser | null> {
  const refreshToken = getRefreshTokenInLocalStorage()

  if (!refreshToken) return null // Se não houver refresh token, não pode renovar

  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        refresh: refreshToken 
      }),
    })

    if (!response.ok) {
      console.error("Erro ao renovar token:", response.statusText)
      cleanLocalStorage()
      return null // Tokens inválidos, necessário fazer login
    }

    const data = await response.json()
    setItemInLocalStorage(data.access, refreshToken)
    return data.access
  } catch (error) {
    console.error("Erro ao renovar token:", error)
    return null
  }
}