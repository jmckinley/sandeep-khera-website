const REPO = 'kyliemckinleydemo/sandeep-khera-website';
const BRANCH = 'main';
const BLOG_PATH = 'content/blog';

function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontMatter = match[1];
  const metadata = {};
  let currentKey = null;

  frontMatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0 && !line.startsWith('  ') && !line.startsWith('-')) {
      currentKey = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      metadata[currentKey] = value === '' ? [] : value;
    } else if (line.trim().startsWith('-') && currentKey && Array.isArray(metadata[currentKey])) {
      metadata[currentKey].push(line.trim().substring(1).trim());
    }
  });

  return metadata;
}

export default async function handler(req, res) {
  try {
    // Get list of files in content/blog from GitHub
    const listUrl = `https://api.github.com/repos/${REPO}/contents/${BLOG_PATH}?ref=${BRANCH}`;
    const listResponse = await fetch(listUrl, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!listResponse.ok) {
      throw new Error(`GitHub API error: ${listResponse.status}`);
    }

    const files = await listResponse.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));

    // Fetch each markdown file's content
    const posts = await Promise.all(mdFiles.map(async (file) => {
      const slug = file.name.replace('.md', '');

      const contentResponse = await fetch(file.download_url);
      const content = await contentResponse.text();
      const metadata = parseFrontMatter(content);

      return {
        slug,
        title: metadata.title || slug,
        date: metadata.date || '',
        image: metadata.image || '/images/blog/default.jpg',
        summary: metadata.summary || '',
        author: metadata.author || 'Sandeep Khera',
        tags: Array.isArray(metadata.tags) ? metadata.tags : []
      };
    }));

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to load posts', details: error.message });
  }
}
