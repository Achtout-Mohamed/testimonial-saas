import { supabaseAdmin } from '@/lib/supabase-admin'
import { checkTestimonialLimit } from '@/lib/limits'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, message, rating, userId } = body

    // Validate required fields
    if (!customerName || !customerEmail || !message || !rating || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Check testimonial limit
    const canAddTestimonial = await checkTestimonialLimit(userId)
    if (!canAddTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial limit reached. Please upgrade to add more testimonials.' }, 
        { status: 403 }
      )
    }

    // Ensure user exists in public.users table
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (!existingUser) {
      // Get user info from auth.users
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
      
      if (authError || !authUser.user) {
        return NextResponse.json(
          { error: 'Invalid user ID' }, 
          { status: 400 }
        )
      }

      // Create user in public.users table
      const { error: insertUserError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email: authUser.user.email,
          name: authUser.user.user_metadata?.name || authUser.user.email,
          created_at: new Date().toISOString()
        })

      if (insertUserError) {
        console.error('Error creating user:', insertUserError)
        // Continue anyway - the foreign key constraint might be removed
      }
    }

    // Insert testimonial into database
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert({
        user_id: userId,
        customer_name: customerName,
        customer_email: customerEmail,
        message: message,
        rating: parseInt(rating),
        approved: false // Default to pending approval
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save testimonial: ' + error.message }, 
        { status: 500 }
      )
    }

    console.log('Testimonial saved successfully:', data)

    return NextResponse.json({ 
      success: true, 
      message: 'Testimonial submitted successfully',
      data: data 
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}