# Blog CMS Setup Guide

This guide explains how to set up the Decap CMS (formerly Netlify CMS) for the Sandeep Khera website blog.

## Overview

The blog system uses:
- **Decap CMS** - Admin interface for creating/editing posts
- **Markdown files** - Posts stored in `content/blog/`
- **GitHub** - Backend storage for posts
- **JavaScript** - Dynamic loading and rendering of posts

## Setup Steps

### Step 1: Set Up GitHub OAuth App

Since we're using Vercel (not Netlify), we need an OAuth provider for authentication.

**Option A: Use a simple OAuth proxy (Recommended)**

1. Deploy this OAuth proxy to Vercel:
   - Fork: https://github.com/vencax/netlify-cms-github-oauth-provider
   - Deploy to Vercel
   - Set environment variables:
     - `OAUTH_CLIENT_ID` - Your GitHub OAuth App Client ID
     - `OAUTH_CLIENT_SECRET` - Your GitHub OAuth App Client Secret

2. Create a GitHub OAuth App:
   - Go to GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Application name: `Sandeep Khera Blog CMS`
   - Homepage URL: `https://fixedwebsite.vercel.app`
   - Authorization callback URL: `https://your-oauth-proxy.vercel.app/callback`
   - Save the Client ID and Client Secret

3. Update `admin/config.yml`:
   ```yaml
   backend:
     name: github
     repo: jmckinley/sandeep-khera-website
     branch: main
     base_url: https://your-oauth-proxy.vercel.app
     auth_endpoint: /api/auth
   ```

**Option B: Use Netlify Identity (if migrating to Netlify)**

If you move hosting to Netlify, you can use Netlify Identity which is simpler:
1. Enable Netlify Identity in your Netlify dashboard
2. Enable Git Gateway
3. Update `admin/config.yml`:
   ```yaml
   backend:
     name: git-gateway
     branch: main
   ```

### Step 2: Access the Admin Panel

Once OAuth is configured:
1. Go to `https://your-site.com/admin/`
2. Click "Login with GitHub"
3. Authorize the application
4. Start creating posts!

## Creating Blog Posts

### Using the Admin Panel

1. Go to `/admin/`
2. Click "Blog Posts" → "New Blog Post"
3. Fill in:
   - **Title** - Post title
   - **Publish Date** - When to publish
   - **Featured Image** - Upload or select an image
   - **Summary** - Short description for the blog listing
   - **Author** - Author name (defaults to Sandeep Khera)
   - **Tags** - Categories for the post
   - **Body** - Main content (supports Markdown)

### Adding YouTube Videos

In the post body, use the YouTube component:
1. Click the "+" button in the editor
2. Select "YouTube"
3. Enter the video ID (e.g., `dQw4w9WgXcQ` from `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)

Or type directly:
```
{{< youtube VIDEO_ID >}}
```

### Adding Images

1. Click the image button in the toolbar
2. Upload a new image or select from existing
3. Images are stored in `/images/blog/`

## Manual Post Creation

You can also create posts manually:

1. Create a new `.md` file in `content/blog/`
2. Add front matter at the top:

```markdown
---
title: "Your Post Title"
date: 2025-01-15
image: /images/blog/your-image.jpg
summary: "Brief description for the listing page"
author: Sandeep Khera
tags:
  - Leadership
  - Mindset
---

Your post content goes here...

## Headings

Regular paragraphs with **bold** and *italic* text.

> Blockquotes for important quotes

- Bullet points
- Work too

{{< youtube VIDEO_ID >}}
```

3. Update `content/blog/posts.json` to include the new post:
```json
{
  "slug": "your-post-slug",
  "title": "Your Post Title",
  "date": "2025-01-15",
  "image": "/images/blog/your-image.jpg",
  "summary": "Brief description",
  "author": "Sandeep Khera",
  "tags": ["Leadership", "Mindset"]
}
```

4. Commit and push to GitHub

## File Structure

```
content/
└── blog/
    ├── posts.json           # Index of all posts (for listing page)
    ├── delegation-lessons.md
    ├── leadership-daughter.md
    └── crash-changed-everything.md

admin/
├── index.html               # CMS admin interface
└── config.yml               # CMS configuration

images/
└── blog/                    # Blog post images
    ├── delegation.jpg
    └── ...
```

## Troubleshooting

### Posts not showing up
- Check that the post is listed in `posts.json`
- Verify the slug matches the filename (without .md)
- Check browser console for errors

### Admin login not working
- Verify GitHub OAuth App settings
- Check that callback URL is correct
- Ensure OAuth proxy is deployed and configured

### Images not loading
- Verify image path starts with `/images/blog/`
- Check that image file exists
- Clear browser cache

## Support

For issues with:
- **CMS**: https://decapcms.org/docs
- **Markdown**: https://www.markdownguide.org
- **This site**: Contact Great Falls Ventures
