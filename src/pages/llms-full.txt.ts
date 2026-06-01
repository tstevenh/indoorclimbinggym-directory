import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import {
  getBlogLlmPages,
  getCoreLlmPages,
  getDirectoryLlmPages,
  renderLlmsFullTxt,
  uniquePages,
} from '../utils/llms';

export const prerender = true;

export async function GET(_context: APIContext) {
  const blogEntries = await getCollection('blog');
  const pages = uniquePages([
    ...getCoreLlmPages(),
    ...getBlogLlmPages(blogEntries),
    ...(await getDirectoryLlmPages()),
  ]);

  return new Response(renderLlmsFullTxt(pages), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
