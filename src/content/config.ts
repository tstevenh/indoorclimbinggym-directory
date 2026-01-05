/**
 * Content Collections Configuration
 * Defines schema for blog posts using Astro Content Collections
 */

import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(60, 'Title must be 60 characters or less for SEO'),
    description: z.string().max(160, 'Description must be 160 characters or less for SEO'),
    publishedDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().optional(), // Defaults to "Indoor Climbing Gym Team"
    authorAvatar: z.string().optional(), // Path to author profile picture (defaults to logo)
    authorBio: z.string().optional(), // Custom bio for this author
    category: z.string().min(2).max(50), // Auto-discovers categories from blog posts
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    wordCount: z.number().optional(),
    readingTime: z.number().optional(), // in minutes
    canonicalURL: z.string().url().optional(), // For republished content - points to original source
  }),
});

export const collections = {
  blog: blogCollection,
};
