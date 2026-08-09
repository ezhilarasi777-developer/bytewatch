import { discoverTopics } from "./discovery.js";
import { judgeTopic } from "./editor.js";
import { writePost } from "./writer.js";

import {
    readMemory,
    addPost,
    addRejectedTopic,
    hasProcessedTopic
} from "./memory.js";

let running = false;

function generateId() {

    return (
        "post-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}

export async function runAgent(agent) {

    if (running) {
        console.log("⚠️ Agent cycle already running");
        return;
    }

    running = true;

    try {

        console.log(
            "\n🤖 ByteWatch is discovering topics..."
        );

        const topics =
            await discoverTopics();

        console.log(
            `Found ${topics.length} topics`
        );

        const memory =
            readMemory();

        let newTopics = 0;

        for (const topic of topics) {

            // ========================================
            // DUPLICATE CHECK
            // ========================================

            if (hasProcessedTopic(topic.url)) {

                console.log(
                    `⏭️ Already processed: ${topic.title}`
                );

                continue;
            }

            newTopics++;

            console.log(
                `\n🆕 New topic: ${topic.title}`
            );


            // ========================================
            // JUDGE TOPIC
            // ========================================

            const decision =
                judgeTopic(topic, memory);

            console.log(
                `Decision: ${
                    decision.publish
                        ? "PUBLISH"
                        : "REJECT"
                }`
            );


            // ========================================
            // REJECT
            // ========================================

            if (!decision.publish) {

                addRejectedTopic({

                    title:
                        topic.title,

                    sourceUrl:
                        topic.url,

                    rejectedAt:
                        new Date().toISOString(),

                    reasons:
                        decision.reasons

                });

                continue;
            }


            // ========================================
            // WRITE POST
            // ========================================

            const text =
                writePost(topic);


            const post = {

                id:
                    generateId(),

                createdAt:
                    new Date().toISOString(),

                text,

                rationale:
                    `Selected because ${
                        decision.reasons.join(" ")
                    }`,

                sources: [
                    topic.url
                ],

                sourceUrl:
                    topic.url,

                topic:
                    topic.title,

                agentId:
                    agent.agentId

            };


            // ========================================
            // SAVE POST
            // ========================================

            addPost(post);


            console.log(
                "✅ Published:",
                topic.title
            );


            // One post per cycle
            break;
        }


        console.log(
            `\n📊 New topics processed: ${newTopics}`
        );

    } catch (error) {

        console.error(
            "Autonomous cycle failed:",
            error.message
        );

    } finally {

        running = false;
    }
}