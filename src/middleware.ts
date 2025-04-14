import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const userRole = token?.role
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")
    const isDoctorPage = req.nextUrl.pathname.startsWith("/doctor")
    const isPatientPage = req.nextUrl.pathname.startsWith("/patient")

    // If user is on auth page and is authenticated, redirect to appropriate dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL(`/${userRole}/dashboard`, req.url))
    }

    // If user is on protected page and is not authenticated, redirect to login
    if ((isDoctorPage || isPatientPage) && !isAuth) {
      const from = req.nextUrl.pathname
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    // Role-based access control
    if (isAuth) {
      if (isDoctorPage && userRole !== "doctor") {
        return NextResponse.redirect(new URL("/patient/dashboard", req.url))
      }
      if (isPatientPage && userRole !== "patient") {
        return NextResponse.redirect(new URL("/doctor/dashboard", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ }) => true, // Let the middleware function handle authorization
    },
  }
)

export const config = {
  matcher: ["/doctor/:path*", "/patient/:path*", "/login", "/register"],
} 