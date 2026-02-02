import { createClient } from '@supabase/supabase-js'

// Dados extraídos da sua imagem
const supabaseUrl = 'https://hyzhbuzxilqikuzxwied.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5emhidXp4aWxxaWt1enh3aWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NzE4MzQsImV4cCI6MjA4NTQ0NzgzNH0.ssk-j9kT914Ey8iHZwKs9BHhVFq3f0GdEc4CdfB-3RU' 
// Nota: Use a 'Anon Key' completa que você copiou!

export const supabase = createClient(supabaseUrl, supabaseKey)
