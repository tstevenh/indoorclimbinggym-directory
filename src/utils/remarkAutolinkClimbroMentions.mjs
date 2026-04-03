import path from 'node:path';

const TARGET_SLUGS = new Set([
  '8-week-finger-strength-plan-indoor-climbers',
  '7-finger-training-mistakes-indoor-climbers-make',
  'best-hangboards-for-beginners-training-at-home',
  'best-smart-hangboard-for-home-climbers-2026',
  'climbro-mini-vs-pro-which-should-you-buy',
  'climbro-rent-vs-buy-which-is-better',
  'climbro-vs-traditional-hangboard',
  'how-often-should-indoor-climbers-train-finger-strength',
  'how-to-build-finger-strength-without-overtraining',
  'how-to-structure-climbing-week-strength-technique-recovery',
  'is-climbro-worth-it-for-indoor-climbers',
  'what-does-climbro-measure',
  'what-makes-a-climbing-gym-beginner-friendly',
  'when-is-a-smart-hangboard-worth-it',
  'who-should-buy-climbro-and-who-should-skip-it',
]);

const LINK_MAP = {
  'Climbro Mini': {
    href: 'https://climbro.com/climbro-mini/',
    intent: 'mini',
  },
  'Climbro Pro': {
    href: 'https://climbro.com/climbro-pro/',
    intent: 'pro',
  },
  Climbro: {
    href: 'https://climbro.com/',
    intent: 'brand',
  },
};

const LINK_PATTERN = /Climbro Mini|Climbro Pro|Climbro/g;
const SKIP_PARENT_TYPES = new Set([
  'definition',
  'heading',
  'html',
  'link',
  'mdxJsxFlowElement',
  'mdxJsxTextElement',
]);

const INLINE_CODE_CLASS =
  'inline-block rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.95em] text-[#e3d46f] no-underline !no-underline hover:bg-white/15 transition-colors';

const sanitize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64);

const getSlugFromFile = (filePath = '') => {
  const basename = path.basename(filePath, path.extname(filePath));
  return basename || '';
};

const buildTrackedUrl = ({ href, source, position, intent, variant }) => {
  const sourceSlug = sanitize(source);
  const positionSlug = sanitize(position);
  const intentSlug = sanitize(intent);
  const variantSlug = sanitize(variant);
  const url = new URL(href);

  url.searchParams.set('wpam_id', '23');
  url.searchParams.set('subid', `${sourceSlug}_${positionSlug}_${intentSlug}`);
  url.searchParams.set('utm_source', 'indoorclimbinggym');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set(
    'utm_campaign',
    `climbro_${sourceSlug}_${positionSlug}_${intentSlug}_${variantSlug}`
  );

  return {
    articleSlug: sourceSlug,
    destination: sanitize(url.pathname.replace(/^\/|\/$/g, '') || 'home'),
    href: url.toString(),
    intentSlug,
    positionSlug,
    sourceSlug,
    variantSlug,
  };
};

const createAnchorNode = ({
  label,
  href,
  source,
  position,
  intent,
  variant,
  className = '',
}) => {
  const tracked = buildTrackedUrl({ href, source, position, intent, variant });

  return {
    type: 'mdxJsxTextElement',
    name: 'a',
    attributes: [
      { type: 'mdxJsxAttribute', name: 'href', value: tracked.href },
      { type: 'mdxJsxAttribute', name: 'target', value: '_blank' },
      { type: 'mdxJsxAttribute', name: 'rel', value: 'noopener noreferrer sponsored' },
      { type: 'mdxJsxAttribute', name: 'data-affiliate-link', value: 'climbro' },
      { type: 'mdxJsxAttribute', name: 'data-affiliate-program', value: 'climbro' },
      { type: 'mdxJsxAttribute', name: 'data-affiliate-source', value: tracked.sourceSlug },
      { type: 'mdxJsxAttribute', name: 'data-affiliate-intent', value: tracked.intentSlug },
      { type: 'mdxJsxAttribute', name: 'data-affiliate-position', value: tracked.positionSlug },
      { type: 'mdxJsxAttribute', name: 'data-affiliate-page-type', value: 'article' },
      { type: 'mdxJsxAttribute', name: 'data-affiliate-variant', value: tracked.variantSlug },
      {
        type: 'mdxJsxAttribute',
        name: 'data-affiliate-subid',
        value: `${tracked.sourceSlug}_${tracked.positionSlug}_${tracked.intentSlug}`,
      },
      { type: 'mdxJsxAttribute', name: 'data-affiliate-destination', value: tracked.destination },
      { type: 'mdxJsxAttribute', name: 'data-affiliate-outbound-url', value: tracked.href },
      { type: 'mdxJsxAttribute', name: 'data-affiliate-article-slug', value: tracked.articleSlug },
      ...(className
        ? [{ type: 'mdxJsxAttribute', name: 'class', value: className }]
        : []),
    ],
    children: [{ type: 'text', value: label }],
  };
};

const replaceTextMentions = (value, slug) => {
  const nodes = [];
  let lastIndex = 0;

  value.replace(LINK_PATTERN, (match, offset) => {
    if (offset > lastIndex) {
      nodes.push({
        type: 'text',
        value: value.slice(lastIndex, offset),
      });
    }

    const linkConfig = LINK_MAP[match];
    nodes.push(
      createAnchorNode({
        label: match,
        href: linkConfig.href,
        source: slug,
        position: 'autolink_inline',
        intent: linkConfig.intent,
        variant: 'autolink_text',
      })
    );
    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex === 0) {
    return null;
  }

  if (lastIndex < value.length) {
    nodes.push({
      type: 'text',
      value: value.slice(lastIndex),
    });
  }

  return nodes;
};

const transformNodeChildren = (node, slug) => {
  if (!Array.isArray(node.children) || SKIP_PARENT_TYPES.has(node.type)) {
    return;
  }

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (child.type === 'text') {
      const replacementNodes = replaceTextMentions(child.value, slug);
      if (replacementNodes) {
        node.children.splice(index, 1, ...replacementNodes);
        index += replacementNodes.length - 1;
        continue;
      }
    }

    if (child.type === 'inlineCode' && LINK_MAP[child.value]) {
      const linkConfig = LINK_MAP[child.value];
      node.children.splice(
        index,
        1,
        createAnchorNode({
          label: child.value,
          href: linkConfig.href,
          source: slug,
          position: 'body_inline',
          intent: linkConfig.intent,
          variant: 'autolink_inline_code',
          className: INLINE_CODE_CLASS,
        })
      );
      continue;
    }

    transformNodeChildren(child, slug);
  }
};

export default function remarkAutolinkClimbroMentions() {
  return (tree, file) => {
    const slug = getSlugFromFile(file.path);
    if (!TARGET_SLUGS.has(slug)) {
      return;
    }

    transformNodeChildren(tree, slug);
  };
}
