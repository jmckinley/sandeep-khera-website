/**
 * Blog functionality for Sandeep Khera website
 * Handles loading and rendering markdown blog posts
 */

// Parse front matter from markdown
function parseFrontMatter(content) {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) {
        return { metadata: {}, body: content };
    }

    const frontMatter = match[1];
    const body = match[2];
    const metadata = {};

    frontMatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            // Handle arrays (tags)
            if (value === '') {
                metadata[key] = [];
            } else {
                metadata[key] = value;
            }
        } else if (line.trim().startsWith('-') && Object.keys(metadata).length > 0) {
            // Handle array items
            const lastKey = Object.keys(metadata).pop();
            if (Array.isArray(metadata[lastKey])) {
                metadata[lastKey].push(line.trim().substring(1).trim());
            }
        }
    });

    return { metadata, body };
}

// Process YouTube embeds in markdown
function processYouTubeEmbeds(content) {
    // Match {{< youtube VIDEO_ID >}} syntax
    const youtubeRegex = /\{\{<\s*youtube\s+(\S+)\s*>\}\}/g;
    return content.replace(youtubeRegex, (match, videoId) => {
        return `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Load and render a single blog post
async function loadPost(slug) {
    const postContent = document.getElementById('post-content');

    try {
        const response = await fetch(`/content/blog/${slug}.md`);

        if (!response.ok) {
            throw new Error('Post not found');
        }

        const content = await response.text();
        const { metadata, body } = parseFrontMatter(content);

        // Update page title and meta description
        document.title = `${metadata.title} | Sandeep Khera`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', metadata.summary || '');
        }

        // Process YouTube embeds before markdown parsing
        const processedBody = processYouTubeEmbeds(body);

        // Render the post
        const tagsHtml = metadata.tags && metadata.tags.length > 0
            ? `<div class="post-tags">${metadata.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}</div>`
            : '';

        const imageHtml = metadata.image
            ? `<img src="${metadata.image}" alt="${metadata.title}" class="post-featured-image">`
            : '';

        postContent.innerHTML = `
            <article>
                <header class="post-header">
                    <div class="post-meta">
                        <span class="post-date">${formatDate(metadata.date)}</span>
                        <span class="post-author">By ${metadata.author || 'Sandeep Khera'}</span>
                    </div>
                    <h1 class="section-title">${metadata.title}</h1>
                    ${tagsHtml}
                </header>
                ${imageHtml}
                <div class="post-body">
                    ${marked.parse(processedBody)}
                </div>
            </article>
        `;

    } catch (error) {
        postContent.innerHTML = `
            <div class="error-message">
                <h2>Post Not Found</h2>
                <p>Sorry, the article you're looking for doesn't exist or has been moved.</p>
                <a href="blog.html" class="btn btn-primary">Back to Blog</a>
            </div>
        `;
    }
}

// Load blog listing from posts.json
async function loadBlogListing() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;

    try {
        const response = await fetch('/content/blog/posts.json');
        const posts = await response.json();

        // Sort by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        blogGrid.innerHTML = posts.map(post => `
            <article class="blog-card">
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
                <div class="blog-card-content">
                    <span class="blog-card-date">${formatDate(post.date)}</span>
                    <h3 class="blog-card-title">${post.title}</h3>
                    <p class="blog-card-excerpt">${post.summary}</p>
                    <a href="post.html?slug=${post.slug}" class="blog-card-link">Read More</a>
                </div>
            </article>
        `).join('');

    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the post page
    if (document.getElementById('post-content')) {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');

        if (slug) {
            loadPost(slug);
        } else {
            document.getElementById('post-content').innerHTML = `
                <div class="error-message">
                    <h2>No Post Selected</h2>
                    <p>Please select an article from the blog.</p>
                    <a href="blog.html" class="btn btn-primary">View Blog</a>
                </div>
            `;
        }
    }

    // Check if we're on the blog listing page
    if (document.getElementById('blog-grid')) {
        loadBlogListing();
    }
});
