import { verifyAdminSession } from '@/lib/admin-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin-session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No admin session found' },
        { status: 401 }
      )
    }

    const userId = await verifyAdminSession(sessionToken)
    
    if (!userId) {
      const response = NextResponse.json(
        { error: 'Invalid or expired admin session' },
        { status: 401 }
      )
      response.cookies.set('admin-session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      })
      return response
    }

    return NextResponse.json({ 
      success: true, 
      userId,
      isAdmin: true 
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}