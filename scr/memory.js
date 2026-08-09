import fs from "fs";
import path from "path";

const memoryPath = path.resolve("data/memory.json");

function ensureMemory() {

    if (!fs.existsSync("data")) {
        fs.mkdirSync("data");
    }

    if (!fs.existsSync(memoryPath)) {

        fs.writeFileSync(
            memoryPath,
            JSON.stringify(
                {
                    posts: [],
                    rejectedTopics: [],
                    processedTopics: []
                },
                null,
                2
            )
        );
    }
}


export function readMemory() {

    ensureMemory();

    const memory =
        JSON.parse(
            fs.readFileSync(
                memoryPath,
                "utf-8"
            )
        );

    // Support old memory.json files
    if (!memory.processedTopics) {
        memory.processedTopics = [];
    }

    if (!memory.posts) {
        memory.posts = [];
    }

    if (!memory.rejectedTopics) {
        memory.rejectedTopics = [];
    }

    return memory;
}


export function saveMemory(memory) {

    ensureMemory();

    fs.writeFileSync(
        memoryPath,
        JSON.stringify(
            memory,
            null,
            2
        )
    );
}


// ========================================
// ADD PUBLISHED POST
// ========================================

export function addPost(post) {

    const memory =
        readMemory();

    memory.posts.push(post);

    // Remember the source
    if (
        post.sourceUrl &&
        !memory.processedTopics.includes(
            post.sourceUrl
        )
    ) {

        memory.processedTopics.push(
            post.sourceUrl
        );
    }

    saveMemory(memory);
}


// ========================================
// ADD REJECTED TOPIC
// ========================================

export function addRejectedTopic(topic) {

    const memory =
        readMemory();

    memory.rejectedTopics.push(topic);

    // Remember rejected source
    if (
        topic.sourceUrl &&
        !memory.processedTopics.includes(
            topic.sourceUrl
        )
    ) {

        memory.processedTopics.push(
            topic.sourceUrl
        );
    }

    // Keep rejected topics limited
    if (
        memory.rejectedTopics.length > 100
    ) {

        memory.rejectedTopics =
            memory.rejectedTopics.slice(-100);
    }

    // Keep processed URLs limited
    if (
        memory.processedTopics.length > 500
    ) {

        memory.processedTopics =
            memory.processedTopics.slice(-500);
    }

    saveMemory(memory);
}


// ========================================
// CHECK WHETHER TOPIC WAS ALREADY PROCESSED
// ========================================

export function hasProcessedTopic(sourceUrl) {

    const memory =
        readMemory();

    return memory.processedTopics.includes(
        sourceUrl
    );
}


// ========================================
// OLD COVERED TOPIC CHECK
// ========================================

export function hasCoveredTopic(title) {

    const memory =
        readMemory();

    const text =
        title.toLowerCase();

    return memory.posts.some(post =>
        post.text
            .toLowerCase()
            .includes(text)
    );
}