export default async function handler(req, res) {
  const REPO = 'kyliemckinleydemo/sandeep-khera-website';
  const BLOG_PATH = 'content/blog';

  try {
    const listUrl = `https://api.github.com/repos/${REPO}/contents/${BLOG_PATH}`;
    const listResponse = await fetch(listUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'sandeepkhera-blog'
      }
    });

    if (!listResponse.ok) {
      return res.status(500).json({ error: 'GitHub API error', status: listResponse.status });
    }

    const files = await listResponse.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));

    const posts = [];
    for (const file of mdFiles) {
      const contentResponse = await fetch(file.download_url);
      const content = await contentResponse.text();

      // Simple frontmatter parsing
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      const metadata = {};

      if (match) {
        match[1].split('\n').forEach(line => {
          const idx = line.indexOf(':');
          if (idx > 0) {
            const key = line.substring(0, idx).trim();
            let val = line.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
            metadata[key] = val;
          }
        });
      }

      posts.push({
        slug: file.name.replace('.md', ''),
        title: metadata.title || file.name,
        date: metadata.date || '',
        image: metadata.image || '/images/blog/default.jpg',
        summary: metadata.summary || '',
        author: metadata.author || 'Sandeep Khera'
      });
    }

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
