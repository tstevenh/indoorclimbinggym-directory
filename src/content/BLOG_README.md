# Blog Content Directory

This directory contains all blog posts for the IndoorClimbingGym.com website using Astro Content Collections.

## File Structure

Each blog post should be a markdown (`.md`) or MDX (`.mdx`) file in this directory.

### File Naming Convention

Use kebab-case for file names:
- `how-much-does-climbing-cost.md`
- `best-climbing-shoes-for-beginners.md`
- `indoor-climbing-tips.md`

The filename becomes the URL slug: `/guides/filename`

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
- Other blog posts: `/guides/post-slug`

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
[Link text](/guides/another-post)
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

- Blog index: `/guides/`
- Category pages: `/guides/{category}/`
- Individual posts: `/guides/{filename}/`
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
- Page templates: `/src/pages/guides/`
