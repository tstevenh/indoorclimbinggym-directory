# Image Upload Guide for IndoorClimbingGym

## Overview
This guide explains how to manage gym hero images for 700+ listings using Supabase Storage with placeholder fallback.

---

## Current Setup ✅

### Placeholder Image
- **Location:** `/public/placeholder-gym.webp`
- **Purpose:** Automatically shown when gym has no hero image
- **Design:** Sage green climbing illustration with "Photo Coming Soon" text
- **Size:** 1920x1080 (16:9 aspect ratio)

### Automatic Fallback System
The image utilities (`/src/utils/imageUtils.ts`) automatically:
1. Check if gym has `hero_image` or `photo` field
2. If missing/null/empty → show placeholder
3. If present → optimize and display real image

**No code changes needed when images are added later!** Just update the database URLs.

---

## Recommended Setup: Supabase Storage

### Why Supabase Storage? ✅

| Feature | Benefit |
|---------|---------|
| **CDN Delivery** | Global edge caching for fast load times |
| **Transformations** | On-the-fly resize/crop (no build needed) |
| **Scalability** | Handles 700+ images easily |
| **Cost** | 1GB free, $0.021/GB after |
| **Dynamic Updates** | Upload anytime without rebuilding site |
| **Security** | Row-level security (RLS) policies |

---

## Step-by-Step: Supabase Storage Setup

### 1. Create Storage Bucket

```sql
-- Run in Supabase SQL Editor
-- Create public bucket for gym images
insert into storage.buckets (id, name, public)
values ('gym-images', 'gym-images', true);
```

### 2. Set Storage Policies

```sql
-- Allow public read access (anyone can view images)
create policy "Public read access"
on storage.objects for select
using ( bucket_id = 'gym-images' );

-- Allow authenticated users to upload (gym owners/admins)
create policy "Authenticated users can upload"
on storage.objects for insert
with check ( bucket_id = 'gym-images' and auth.role() = 'authenticated' );

-- Allow gym owners to update their own images
create policy "Gym owners can update"
on storage.objects for update
using ( bucket_id = 'gym-images' and auth.role() = 'authenticated' );
```

### 3. Update Gym Database Schema

Your `gyms` table already has these fields:
- `photo` (TEXT) - Current Unsplash URLs
- `hero_image` (TEXT) - Can be used for Supabase URLs

**Recommended:** Use `hero_image` for Supabase Storage URLs, keep `photo` as fallback.

---

## Bulk Upload: 700 Gym Images

### Option A: Manual Upload via Dashboard (Small Scale)

**For ~50 images:**
1. Go to Supabase Dashboard → Storage → `gym-images` bucket
2. Click "Upload Files"
3. Select multiple images (name them: `gym-{id}.jpg`)
4. Copy public URLs
5. Update database with URLs

### Option B: Programmatic Upload (Recommended for 700+)

**Use Node.js script:**

```typescript
// scripts/upload-gym-images.ts
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key for admin access
)

async function uploadGymImages() {
  const imageDir = './gym-images' // Folder with your 700 images
  const images = fs.readdirSync(imageDir)

  for (const imageFile of images) {
    // Extract gym ID from filename (e.g., "gym-123.jpg" → 123)
    const gymId = parseInt(imageFile.match(/gym-(\d+)/)?.[1] || '0')
    if (!gymId) continue

    const filePath = path.join(imageDir, imageFile)
    const fileBuffer = fs.readFileSync(filePath)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('gym-images')
      .upload(`${gymId}/${imageFile}`, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true, // Overwrite if exists
      })

    if (error) {
      console.error(`Failed to upload ${imageFile}:`, error)
      continue
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('gym-images')
      .getPublicUrl(`${gymId}/${imageFile}`)

    const publicUrl = urlData.publicUrl

    // Update gym database record
    const { error: updateError } = await supabase
      .from('gyms')
      .update({ hero_image: publicUrl })
      .eq('id', gymId)

    if (updateError) {
      console.error(`Failed to update gym ${gymId}:`, updateError)
    } else {
      console.log(`✅ Uploaded and linked: gym ${gymId}`)
    }
  }
}

uploadGymImages()
```

**Run:**
```bash
npm install @supabase/supabase-js
tsx scripts/upload-gym-images.ts
```

### Option C: CSV Import + URL Update

If you have images hosted elsewhere (Cloudinary, AWS S3, etc.):

1. Export gym IDs to CSV
2. Upload images to external service
3. Generate public URLs
4. Bulk update database:

```sql
-- Bulk update from CSV
update gyms set hero_image = 'https://cdn.example.com/gym-1.jpg' where id = 1;
update gyms set hero_image = 'https://cdn.example.com/gym-2.jpg' where id = 2;
-- ... (use CSV import tool for 700 rows)
```

---

## Image Naming Convention

**Recommended Structure:**

```
gym-images/
├── {gym-id}/
│   ├── hero.jpg          (main hero image - 2400x1350)
│   ├── hero-mobile.jpg   (optional mobile variant - 1200x675)
│   ├── interior-1.jpg    (additional gallery images)
│   ├── interior-2.jpg
│   └── exterior.jpg
```

**Benefits:**
- Organized by gym ID (easy to find)
- Consistent naming (easy to automate)
- Scalable (supports multiple images per gym)

---

## Image Optimization Before Upload

**Use these tools to optimize images before uploading:**

### Online Tools:
- **TinyPNG** - https://tinypng.com/ (WebP conversion)
- **Squoosh** - https://squoosh.app/ (Google's tool)
- **ImageOptim** - https://imageoptim.com/mac (Mac app)

### Command Line:
```bash
# Install ImageMagick
brew install imagemagick

# Resize and optimize all images in folder
for img in *.jpg; do
  convert "$img" -resize 2400x1350^ -gravity center -extent 2400x1350 -quality 85 "optimized-$img"
done

# Convert to WebP (smaller file size)
for img in *.jpg; do
  cwebp -q 85 "$img" -o "${img%.jpg}.webp"
done
```

**Target Specs:**
- **Format:** JPG or WebP
- **Dimensions:** 2400 x 1350 (16:9 ratio)
- **Quality:** 80-85%
- **File Size:** 150-300 KB per image

---

## Database Migration: Placeholder to Real Images

When you're ready to replace placeholder with real images:

### Phase 1: Upload Images (Zero Downtime)
```bash
# Upload all 700 images to Supabase Storage
# Site continues showing placeholder during upload
```

### Phase 2: Update Database (Instant Switch)
```sql
-- Update all gyms at once
update gyms
set hero_image = concat(
  'https://your-project.supabase.co/storage/v1/object/public/gym-images/',
  id,
  '/hero.jpg'
)
where hero_image is null;
```

### Phase 3: Verify (Automatic Fallback)
- If URL is valid → real image displays
- If URL is broken → placeholder displays automatically
- No 404 errors, no broken images!

---

## Cost Estimation

### Supabase Storage Pricing:
- **Free Tier:** 1GB storage, 2GB bandwidth/month
- **Pro Tier:** $0.021/GB storage, $0.09/GB bandwidth

### 700 Gym Images:
- Average image size: 250 KB
- Total storage: 700 × 0.25 MB = **175 MB** ✅ (fits in free tier!)
- Monthly bandwidth (10k views/month): 175 MB × 10k = **1.75 GB** ✅ (fits in free tier!)

**Estimated Cost:** $0/month for first year (free tier covers you!)

---

## Testing the Placeholder System

### Test Cases:

1. **Gym with no image** (null `hero_image`):
   - ✅ Should show placeholder

2. **Gym with empty string** (`hero_image = ""`):
   - ✅ Should show placeholder

3. **Gym with invalid URL** (`hero_image = "https://broken.com/404.jpg"`):
   - ✅ Should show placeholder (after error)

4. **Gym with valid Unsplash URL**:
   - ✅ Should show optimized Unsplash image

5. **Gym with Supabase Storage URL**:
   - ✅ Should show uploaded image (no optimization)

---

## Migration Checklist

- [✅] Placeholder image copied to `/public/placeholder-gym.webp`
- [✅] Image utilities updated with fallback logic
- [✅] `getImageUrl()` function handles null/undefined
- [✅] `optimizeUnsplashUrl()` returns placeholder on error
- [✅] `generateSrcset()` returns placeholder for invalid URLs
- [ ] Create `gym-images` bucket in Supabase Storage
- [ ] Set storage policies (public read, authenticated upload)
- [ ] Prepare 700 gym images (optimize, rename)
- [ ] Write upload script or use dashboard
- [ ] Bulk upload images to Supabase
- [ ] Update `gyms.hero_image` column with public URLs
- [ ] Test placeholder fallback with null values
- [ ] Test real images display correctly
- [ ] Monitor storage usage in Supabase dashboard

---

## Support & Troubleshooting

### Common Issues:

**Q: Images not showing after upload?**
- Check bucket is public: `storage.buckets.public = true`
- Verify URL format: `https://{project}.supabase.co/storage/v1/object/public/gym-images/{id}/hero.jpg`
- Check CORS settings in Supabase dashboard

**Q: Placeholder not showing?**
- Verify file exists: `/public/placeholder-gym.webp`
- Check browser console for 404 errors
- Ensure `PLACEHOLDER_IMAGE` constant matches filename

**Q: Upload script failing?**
- Use `SUPABASE_SERVICE_KEY` (not anon key) for admin access
- Check file permissions on image folder
- Verify gym IDs match database records

---

## Next Steps

1. **Immediate:** Site works with placeholder (development ready) ✅
2. **Short-term:** Create Supabase Storage bucket and policies
3. **Medium-term:** Prepare and optimize 700 gym images
4. **Long-term:** Build bulk upload script and migrate images

**Current Status:** Your site is production-ready with placeholders! Real images can be added later without any code changes.
