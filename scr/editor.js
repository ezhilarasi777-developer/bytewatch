const strongWords = [
    "developer",
    "developers",
    "software",
    "coding",
    "programming",
    "github",
    "open source",
    "api",
    "sdk",
    "llm",
    "machine learning",
    "artificial intelligence",
    "ai model",
    "ai agent",
    "developer tools",
    "robotics",
    "cloud",
    "database",
    "cybersecurity"
];

const weakWords = [
    "ai",
    "model",
    "technology",
    "search"
];

const irrelevantWords = [
    "dinner",
    "recipe",
    "cooking",
    "travel",
    "vacation",
    "fashion",
    "celebrity",
    "shopping",
    "party",
    "sports"
];
function normalizeTitle(title) {
    return (title || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
export function judgeTopic(topic, memory) {

    const combinedText = (
        (topic.title || "") +
        " " +
        (topic.description || "")
    ).toLowerCase();

    let score = 0;
    const reasons = [];

    // ========================================
    // TECHNOLOGY RELEVANCE
    // ========================================

    const strongMatches = strongWords.filter(word =>
        combinedText.includes(word)
    );

    const weakMatches = weakWords.filter(word =>
        combinedText.includes(word)
    );

    const irrelevantMatches = irrelevantWords.filter(word =>
        combinedText.includes(word)
    );


    if (strongMatches.length > 0) {

        score += 50;

        reasons.push(
            "Strongly relevant to developers or software technology."
        );

    } else if (weakMatches.length > 0) {

        score += 20;

        reasons.push(
            "Related to AI or technology, but developer relevance is weaker."
        );

    } else {

        reasons.push(
            "Topic does not strongly match ByteWatch's technology focus."
        );
    }


    // ========================================
    // IRRELEVANT TOPIC PENALTY
    // ========================================

    if (irrelevantMatches.length > 0) {

        score -= 40;

        reasons.push(
            "Topic contains content outside ByteWatch's developer focus."
        );
    }


    // ========================================
    // FRESHNESS
    // ========================================

    const publishedTime =
        new Date(topic.publishedAt).getTime();

    if (!Number.isNaN(publishedTime)) {

        const ageHours =
            (Date.now() - publishedTime) /
            (1000 * 60 * 60);

        if (ageHours <= 168) {

            score += 30;

            reasons.push(
                "The information is recent."
            );

        } else {

            reasons.push(
                "The information is older than ByteWatch's preferred window."
            );
        }

    } else {

        reasons.push(
            "Publication date could not be verified."
        );
    }


    // ========================================
    // SOURCE
    // ========================================

    if (topic.url) {

        score += 20;

        reasons.push(
            "A verifiable source is available."
        );

    } else {

        reasons.push(
            "No verifiable source is available."
        );
    }


    // ========================================
    // DUPLICATE PROTECTION
    // ========================================

    const topicTitle = normalizeTitle(topic.title);

const duplicate = memory.posts.some(post => {

    const sameUrl =
        post.sourceUrl === topic.url;

    const sameTitle =
        normalizeTitle(post.topic) === topicTitle;

    return sameUrl || sameTitle;
});

    if (duplicate) {

        score = 0;

        reasons.push(
            "ByteWatch has already published this source."
        );
    }


    // ========================================
    // FINAL DECISION
    // ========================================

    const publish = score >= 60;

    return {
        publish,
        score,
        reasons
    };
}