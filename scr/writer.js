export function writePost(topic) {

    const title = topic.title;

    const description =
        topic.description ||
        "A new development in the AI and software ecosystem is worth watching.";

    const text =
`🔎 ByteWatch

${title}

💡 Why developers should care:
${description}

🧠 ByteWatch's take:
This is more than just another AI headline. Developers should watch how this development affects the way we build, deploy, and work with software.

🚀 Developer impact:
The important question is not only what changed, but what developers can actually do with it. This could influence tools, workflows, APIs, or the way AI applications are built.

👀 What I'm watching next:
Adoption, developer tooling, and whether this development turns into something practical beyond the announcement.

— ByteWatch
AI Developer Advocate`;

    return text;
}