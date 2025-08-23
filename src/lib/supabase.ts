import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      visits: {
        Row: {
          id: number
          created_at: string
          patient_name: string
          insurance_company: string
          location: string
          visit_date: string
          visit_time: string
          revenue: number
          reminder: boolean
          user_id: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          patient_name: string
          insurance_company: string
          location: string
          visit_date: string
          visit_time: string
          revenue: number
          reminder?: boolean
          user_id: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          patient_name?: string
          insurance_company?: string
          location?: string
          visit_date?: string
          visit_time?: string
          revenue?: number
          reminder?: boolean
          user_id?: string
          updated_at?: string | null
        }
      }
    }
  }
}