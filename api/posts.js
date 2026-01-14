import fs from 'fs';
import path from 'path';

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

      // Remove quotes
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

export default function handler(req, res) {
  try {
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

    const posts = files.map(filename => {
      const slug = filename.replace('.md', '');
      const filePath = path.join(blogDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
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
    });

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error reading blog posts:', error);
    res.status(500).json({ error: 'Failed to load posts' });
  }
}
