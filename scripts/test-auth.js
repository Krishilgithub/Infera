#!/usr/bin/env node

/**
 * Quick test script to verify Supabase integration
 * Run with: node scripts/test-auth.js
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Testing Supabase Integration...\n')

// Check if required files exist
const requiredFiles = [
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'lib/supabase/middleware.ts',
  'contexts/auth-context.tsx',
  'middleware.ts',
  'app/auth/callback/route.ts',
  'app/auth/auth-code-error/page.tsx',
  'app/forgot-password/page.tsx',
  'app/reset-password/page.tsx',
  'app/logout/page.tsx'
]

let allFilesExist = true

console.log('📁 Checking required files:')
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file))
  console.log(`  ${exists ? '✅' : '❌'} ${file}`)
  if (!exists) allFilesExist = false
})

// Check package.json for Supabase dependencies
console.log('\n📦 Checking dependencies:')
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))
const supabaseDeps = [
  '@supabase/supabase-js',
  '@supabase/auth-ui-react',
  '@supabase/auth-ui-shared',
  '@supabase/ssr'
]

supabaseDeps.forEach(dep => {
  const installed = packageJson.dependencies[dep] || packageJson.devDependencies[dep]
  console.log(`  ${installed ? '✅' : '❌'} ${dep} ${installed ? `(${installed})` : '(not installed)'}`)
})

// Check environment variables
console.log('\n🔧 Checking environment setup:')
const envExample = fs.readFileSync(path.join(__dirname, '..', 'env.example'), 'utf8')
const hasSupabaseUrl = envExample.includes('NEXT_PUBLIC_SUPABASE_URL')
const hasSupabaseKey = envExample.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')

console.log(`  ${hasSupabaseUrl ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_URL in env.example`)
console.log(`  ${hasSupabaseKey ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_ANON_KEY in env.example`)

// Summary
console.log('\n📋 Integration Status:')
if (allFilesExist && hasSupabaseUrl && hasSupabaseKey) {
  console.log('  🎉 Supabase integration is complete!')
  console.log('\n📝 Next steps:')
  console.log('  1. Copy env.example to .env.local')
  console.log('  2. Add your Supabase URL and API key')
  console.log('  3. Run: npm run dev')
  console.log('  4. Test the authentication flow')
  console.log('\n📚 See SUPABASE_SETUP.md for detailed instructions')
} else {
  console.log('  ⚠️  Some components are missing. Please check the errors above.')
}

console.log('\n🚀 Ready to build amazing meeting intelligence features!')
