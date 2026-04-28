import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Mimic __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env manually
const envPath = path.resolve(__dirname, '.env')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => {
      const [key, ...vals] = line.split('=')
      return [key.trim(), vals.join('=').trim()]
    })
)

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const ASSETS_DIR = path.join(__dirname, 'assets')
const BUCKET_NAME = 'images'

async function migrate() {
  console.log('🚀 Starting asset migration...')

  const files = []
  function getFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file)
      if (fs.statSync(fullPath).isDirectory()) {
        getFiles(fullPath)
      } else {
        files.push(fullPath)
      }
    })
  }

  getFiles(ASSETS_DIR)

  for (const filePath of files) {
    const relativePath = path.relative(ASSETS_DIR, filePath)
    const fileName = path.basename(filePath)
    const fileContent = fs.readFileSync(filePath)
    
    // Determine target folder/bucket path
    const targetPath = relativePath.replace(/\\/g, '/')
    
    console.log(`Uploading ${targetPath}...`)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(targetPath, fileContent, {
        upsert: true,
        contentType: getContentType(fileName)
      })

    if (uploadError) {
      console.error(`❌ Failed to upload ${targetPath}:`, uploadError.message)
      continue
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(targetPath)

    // Insert into DB based on path
    if (targetPath.startsWith('gallery/')) {
      // Map 'gallery/' folder to 'gallery_images' table
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          url: publicUrl,
          alt_text: fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          category: 'gallery'
        })
      
      if (dbError) console.error(`❌ Failed to insert ${fileName} into gallery_images:`, dbError.message)
      else console.log(`✅ ${fileName} linked to gallery_images`)

    } else if (targetPath === 'logo.png') {
      // Special case for logo if needed, or just upload to storage
      console.log('✅ Logo uploaded to storage')
    } else {
      // Everything else into campus_images for now
      const { error: dbError } = await supabase
        .from('campus_images')
        .insert({
          url: publicUrl,
          alt_text: fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
        })
      
      if (dbError) console.error(`❌ Failed to insert ${fileName} into campus_images:`, dbError.message)
      else console.log(`✅ ${fileName} linked to campus_images`)
    }
  }

  console.log('🎉 Migration complete!')
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase()
  switch (ext) {
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.svg': return 'image/svg+xml'
    default: return 'application/octet-stream'
  }
}

migrate()
