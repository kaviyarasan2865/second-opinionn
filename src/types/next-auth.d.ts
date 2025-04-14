import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    role: string
    name?: string | null
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
} 
