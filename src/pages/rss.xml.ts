/**
 * RSS Feed
 * Generates RSS feed for blog posts
 */

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog');

  // Sort posts by date (most recent first)
  const sortedPosts = blog.sort(
    (a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime()
  );

  return rss({
    title: 'IndoorClimbingGym.com | Climbing Guides & Resources',
    description:
      'Expert guides, tips, and resources for indoor climbing. Learn about climbing techniques, gym memberships, gear reviews, and more.',
    site: context.site || 'https://www.indoorclimbinggym.com',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedDate,
      link: `/blog/${post.slug}`,
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author,
    })),
    customData: '<language>en-us</language>',
    stylesheet: '/rss-styles.xsl',
  });
}
