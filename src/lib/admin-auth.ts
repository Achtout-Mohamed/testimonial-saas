import { supabaseAdmin } from '@/lib/supabase-admin'
import { createSupabaseComponentClient } from '@/lib/supabase'

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('is_admin, role')
      .eq('id', userId)
      .single()

    if (error) {
      return false
    }

    return user?.is_admin === true && user?.role === 'admin'
  } catch (error) {
    return false
  }
}

export async function createAdminSession(userId: string): Promise<string | null> {
  try {
    const isAdmin = await isUserAdmin(userId)
    if (!isAdmin) {
      return null
    }

    const sessionToken = generateSecureToken()
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours

    // Clean up old sessions
    await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .eq('user_id', userId)

    // Create new session
    const { error } = await supabaseAdmin
      .from('admin_sessions')
      .insert({
        user_id: userId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      })

    if (error) {
      return null
    }

    return sessionToken
  } catch (error) {
    return null
  }
}

export async function verifyAdminSession(sessionToken: string): Promise<string | null> {
  try {
    const { data: session, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .single()

    if (error || !session) {
      return null
    }

    // Check if session is expired
    if (new Date() > new Date(session.expires_at)) {
      await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('session_token', sessionToken)
      return null
    }

    // Verify user is still admin
    const isAdmin = await isUserAdmin(session.user_id)
    if (!isAdmin) {
      await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('session_token', sessionToken)
      return null
    }

    return session.user_id
  } catch (error) {
    return null
  }
}

export async function destroyAdminSession(sessionToken: string): Promise<void> {
  try {
    await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .eq('session_token', sessionToken)
  } catch (error) {
    // Silent fail
  }
}

function generateSecureToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function checkAdminAccess(): Promise<boolean> {
  try {
    const supabase = createSupabaseComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    const response = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId: user.id })
    })

    return response.ok
  } catch (error) {
    return false
  }
}