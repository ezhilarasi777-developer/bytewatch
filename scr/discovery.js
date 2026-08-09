import Parser from "rss-parser";

const parser = new Parser();

const feeds = [
    {
        name: "Hugging Face",
        url: "https://huggingface.co/blog/feed.xml"
    },
    {
        name: "Google AI",
        url: "https://blog.google/technology/ai/rss/"
    },
    {
        name: "OpenAI",
        url: "https://openai.com/news/rss.xml"
    }
];

export async function discoverTopics() {

    const topics = [];

    for (const feed of feeds) {

        try {

            const result = await parser.parseURL(feed.url);

            for (const item of result.items.slice(0, 5)) {

                if (!item.title || !item.link) {
                    continue;
                }

                topics.push({
                    title: item.title,
                    description: item.contentSnippet || "",
                    url: item.link,
                    source: feed.name,
                    publishedAt:
                        item.isoDate ||
                        item.pubDate ||
                        new Date().toISOString()
                });
            }

        } catch (error) {

            console.log(
                `Feed failed: ${feed.name}`
            );
        }
    }

    return topics;
}