# Blog Content Directory

This directory contains all blog posts for the IndoorClimbingGym.com website using Astro Content Collections.

## File Structure

Each blog post should be a markdown (`.md`) or MDX (`.mdx`) file in this directory.

### File Naming Convention

Use kebab-case for file names:
- `how-much-does-climbing-cost.md`
- `best-climbing-shoes-for-beginners.md`
- `indoor-climbing-tips.md`

The filename becomes the URL slug: `/blog/filename`

## Required Frontmatter

Every blog post MUST include the following frontmatter fields:

```yaml
---
title: "Your Post Title"
description: "Meta description (max 160 characters for SEO)"
publishedDate: 2025-01-15  # Format: YYYY-MM-DD
author: "Author Name"
category: "guides"  # Must be one of: guides, tips, reviews, industry, gear
tags: ["tag1", "tag2", "tag3"]  # Array of relevant tags
featured: false  # Set to true for homepage featured posts
heroImage: "/images/blog/your-image.jpg"
heroImageAlt: "Descriptive alt text for accessibility"
wordCount: 2150  # Optional but recommended for SEO
readingTime: 8  # Optional, estimated minutes to read
---
```

## Category Guidelines

### guides
Comprehensive, step-by-step guides (1500-3000 words):
- "Complete Beginner's Guide to Indoor Climbing"
- "How to Progress from V0 to V5"
- "Ultimate Guide to Climbing Gym Memberships"

### tips
Quick tips and techniques (800-1500 words):
- "5 Ways to Improve Your Footwork"
- "Warm-up Routines for Climbers"
- "How to Prevent Climbing Injuries"

### gear
Equipment reviews and recommendations (1000-2000 words):
- "Best Climbing Shoes for Wide Feet"
- "Harness Buying Guide"
- "Top 5 Chalk Bags for 2025"

### reviews
Gym reviews and comparisons (1200-2000 words):
- "Seattle Bouldering Project: Full Review"
- "Comparing Boulder Climbing Gyms"
- "Best Family-Friendly Gyms in Austin"

### industry
News, trends, and industry insights (800-1800 words):
- "New Climbing Gyms Opening in 2025"
- "The Rise of Climbing in the Olympics"
- "Industry Trends: Gym Design Evolution"

## SEO Best Practices

### Target Keywords
Focus on long-tail keywords from user research:
- "how much does it cost to climb at a gym"
- "bouldering vs rock climbing difference"
- "climbing gym for beginners"
- "what to wear rock climbing indoor"
- "indoor climbing tips for beginners"

### Word Count
- Minimum: 1500 words for comprehensive coverage
- Optimal: 2000-2500 words for SEO
- Include proper heading hierarchy (H2, H3)

### Internal Linking
Link to relevant pages within the content:
- Gym detail pages: `/gyms/gym-slug`
- City pages: `/wa/seattle`
- Category pages: `/categories/best-bouldering-gyms`
- Other blog posts: `/blog/post-slug`

## Markdown Features

### Headings
```markdown
## Main Section (H2)
### Subsection (H3)
#### Minor Point (H4)
```

### Lists
```markdown
- Bullet point
- Another point

1. Numbered item
2. Another item
```

### Links
```markdown
[Link text](/blog/another-post)
[External link](https://example.com)
```

### Images
```markdown
![Alt text](/images/blog/image.jpg)
```

### Blockquotes
```markdown
> Important note or quote
```

### Code
```markdown
Inline `code` or:

\`\`\`javascript
// Code block
const example = true;
\`\`\`
```

## Publishing Workflow

1. Create your `.md` file in this directory
2. Add complete frontmatter
3. Write content with proper headings and structure
4. Add internal links to relevant pages
5. Build locally to verify: `npm run build`
6. Commit and deploy

## URLs Generated

- Blog index: `/blog/`
- Category pages: `/blog/{category}/`
- Individual posts: `/blog/{filename}/`
- RSS feed: `/rss.xml`

## Example Post Structure

```markdown
---
title: "How to Start Indoor Climbing as a Complete Beginner"
description: "Everything you need to know to start indoor climbing: costs, equipment, techniques, and finding the right gym for your first climb."
publishedDate: 2025-01-20
author: "Alex Chen"
category: "guides"
tags: ["beginners", "getting-started", "tips", "equipment"]
featured: true
heroImage: "/images/blog/beginner-climber.jpg"
heroImageAlt: "Beginner climber on indoor wall with instructor"
wordCount: 2200
readingTime: 9
---

## Introduction

Opening paragraph that hooks the reader...

## Main Section 1

Content with helpful information...

### Subsection 1.1

More detailed content...

## Main Section 2

Continue with structured content...

## Conclusion

Wrap up and call-to-action...

---

*Ready to find your local climbing gym? Browse our [complete directory](/search) of gyms nationwide.*
```

## Questions?

If you have questions about the blog system, check:
- Content collection config: `/src/content/config.ts`
- Blog components: `/src/components/blog/`
- Page templates: `/src/pages/blog/`


  Method 1: Using Public Folder (Recommended for Blog)

  Step 1: Add Your Image

  Place your images in the /public/images/blog/ folder:

  /public/
    /images/
      /blog/
        - climbing-technique.jpg
        - gym-equipment.png
        - bouldering-tips.jpg

  Step 2: Reference in Markdown

  In your blog post markdown file (e.g., /src/content/blog/my-post.md):

  ---
  title: "My Blog Post"
  description: "..."
  heroImage: "/images/gyms/hero.jpg"  # Hero image at top
  ---

  This is my blog content.

  ![Climbing technique demonstration](/images/blog/climbing-technique.jpg)

  More text here...

  ![Gym equipment setup](/images/blog/gym-equipment.png)

  Standard Markdown Image Syntax:

  ![Alt text description](/path/to/image.jpg)

  - ![...] = Image syntax
  - Alt text = Description for accessibility (shows if image fails to load)
  - /path/to/image.jpg = Path starting from /public/ folder

  Method 2: External Images (Unsplash, etc.)

  You can also use external URLs:

  ![Climber on wall](https://images.unsplash.com/photo-123456789)

  Adding Captions

  For images with captions, use this pattern:

  ![Climbing technique](/images/blog/technique.jpg)
  *Figure 1: Proper foot placement on small holds*

  The italic text below becomes a caption.

  Image with Link

  Make an image clickable:

  [![Click to see full size](/images/blog/small.jpg)](/images/blog/large.jpg)

  Example: Full Blog Post with Images

  Let me show you a complete example:

  ---
  title: "5 Essential Bouldering Techniques for Beginners"
  description: "Master these fundamental bouldering moves to progress faster"
  publishedDate: 2025-01-15
  author: "Alex Chen"
  category: "tips"
  tags: ["bouldering", "technique", "beginners", "training", "skills"]
  heroImage: "/images/blog/bouldering-hero.jpg"
  heroImageAlt: "Climber working on a bouldering problem"
  ---

  Bouldering is all about technique over strength. Here are 5 essential moves every beginner should master.

  ## 1. Proper Footwork

  Good footwork is the foundation of climbing. Focus on placing your feet deliberately on each hold.

  ![Foot placement technique](/images/blog/foot-placement.jpg)
  *Precise foot placement saves energy and improves balance*

  Key tips:
  - Look at the hold before placing your foot
  - Use the inside edge of your shoe
  - Keep your heel low for better grip

  ## 2. Hip Movement

  ![Hip positioning](/images/blog/hip-technique.jpg)

  Getting your hips close to the wall shifts your center of gravity and makes moves easier. Practice "flagging" where you extend one leg for balance.

  ## 3. Straight Arms

  ![Straight arm technique](/images/blog/straight-arms.jpg)
  *Hanging on straight arms conserves energy*

  Bent arms tire quickly. Keep arms straight and hang from your skeleton, not your muscles.

  ---

  Want to practice these techniques? Check out our [best bouldering gyms](/categories/best-bouldering-climbing-gyms).

  Pro Tips:

  1. Image Sizes

  - Hero images: 1200x600px minimum
  - Inline images: 800-1000px wide
  - Keep file sizes under 500KB (compress images)

  2. File Naming

  Use descriptive, lowercase names with hyphens:
  - ✅ climbing-technique-footwork.jpg
  - ❌ IMG_1234.jpg

  3. Alt Text

  Always write descriptive alt text:
  - ✅ ![Climber demonstrating drop knee technique on overhang](...)
  - ❌ ![image](...)

  4. Image Formats

  - Use JPG for photos
  - Use PNG for graphics/screenshots
  - Use WebP for best compression (modern browsers)

  Quick Start: Add an Image Now

  1. Create the folder:
  mkdir -p public/images/blog

  2. Add your image to that folder
  3. Edit your blog post:
  ![Your description](/images/blog/your-image.jpg)

  4. Rebuild:
  npm run build

  That's it! Your images will appear in your blog posts. The /public/ folder is served directly, so /public/images/blog/photo.jpg becomes /images/blog/photo.jpg in your URLs.
