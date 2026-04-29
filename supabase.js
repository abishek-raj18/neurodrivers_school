import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────────────────────
// Environment-aware config
//   • Vite (browser / local dev) → import.meta.env  (injected at build time)
//   • Node.js (Railway / scripts) → process.env     (runtime environment)
// ─────────────────────────────────────────────────────────────────────────────
const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null

const supabaseUrl = isNode
  ? process.env.VITE_SUPABASE_URL
  : import.meta.env.VITE_SUPABASE_URL

const supabaseAnonKey = isNode
  ? process.env.VITE_SUPABASE_ANON_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY

// ─────────────────────────────────────────────────────────────────────────────
// Initialize client only when valid credentials are present
// ─────────────────────────────────────────────────────────────────────────────
let supabase = null

if (
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_project_url_here' &&
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.startsWith('https://')
) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.info('✅ Supabase client initialized.')
  } catch (e) {
    console.warn('⚠️  Supabase client failed to initialize:', e.message)
  }
} else {
  console.warn('⚠️  Supabase credentials not set — running in static mode.')
}

export { supabase }
