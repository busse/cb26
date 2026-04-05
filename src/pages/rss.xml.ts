import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "../data/site";

export async function GET(context: { site: URL }) {
  const posts = (await getCollection("posts"))
    .filter((post) => !post.data.draft);

  const photos = (await getCollection("photos"))
    .filter((photo) => !photo.data.draft);

  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/posts/${post.id}`,
      content: post.body,
    })),
    ...photos.map((photo) => ({
      title: photo.data.title,
      description: photo.data.description,
      pubDate: photo.data.date,
      link: `/photos/${photo.id}`,
      content: photo.body,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items,
  });
}
