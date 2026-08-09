import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import fs from "fs";

import { startScheduler } from "./scr/scheduler.js";
import { readMemory } from "./scr/memory.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const agentFile = "./agent.json";


// ========================================
// AGENT STORAGE
// ========================================

function loadAgent() {

    if (!fs.existsSync(agentFile)) {
        return null;
    }

    const data = JSON.parse(
        fs.readFileSync(agentFile, "utf-8")
    );

    return data.agent;
}


function saveAgent(agent) {

    fs.writeFileSync(
        agentFile,
        JSON.stringify(
            { agent },
            null,
            2
        )
    );
}


// ========================================
// LOAD EXISTING AGENT
// ========================================

let agent = loadAgent();


// ========================================
// START EXISTING AGENT AUTOMATICALLY
// ========================================

if (agent) {

    console.log(
        `\n🤖 Existing agent loaded: ${agent.persona.name}`
    );

    console.log(
        `🆔 Agent ID: ${agent.agentId}`
    );

    // Start autonomous operation
    startScheduler(agent);
}


// ========================================
// INITIALIZE AGENT
// ========================================

app.post("/api/agent/init", (req, res) => {

    try {

        const persona = req.body.persona;

        if (!persona) {

            return res.status(400).json({
                error: "persona is required"
            });

        }


        // If agent already exists
        if (agent) {

            return res.json({
                agentId: agent.agentId,
                message: "Existing agent restored"
            });

        }


        // ========================================
        // CREATE NEW AGENT
        // ========================================

        const agentId = crypto.randomUUID();

        agent = {

            agentId,

            persona: {

                name:
                    persona.name ||
                    "ByteWatch",

                domain:
                    persona.domain ||
                    "AI Developer Advocacy"

            },

            initializedAt:
                new Date().toISOString()

        };


        // Save agent permanently
        saveAgent(agent);


        console.log(
            `\n🤖 Agent initialized: ${agent.persona.name}`
        );

        console.log(
            `🆔 Agent ID: ${agent.agentId}`
        );


        // Start autonomous operation
        startScheduler(agent);


        return res.json({
            agentId: agent.agentId,
            message: "Agent initialized"
        });

    } catch (error) {

        console.error(
            "Initialization error:",
            error
        );

        return res.status(500).json({
            error: "Failed to initialize agent"
        });

    }

});


// ========================================
// RETRIEVE FEED
// ========================================

app.get("/api/agent/feed", (req, res) => {

    try {

        const agentId = req.query.agentId;


        if (!agentId) {

            return res.status(400).json({
                error: "agentId is required"
            });

        }


        if (!agent || agent.agentId !== agentId) {

            return res.status(404).json({
                error: "Agent not found"
            });

        }


        const memory = readMemory();


        const posts = memory.posts

            .filter(post =>
                post.agentId === agentId
            )

            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )

            .map(post => ({

                id: post.id,

                createdAt:
                    post.createdAt,

                text:
                    post.text,

                rationale:
                    post.rationale,

                sources:
                    post.sources

            }));


        return res.json({
            posts
        });

    } catch (error) {

        console.error(
            "Feed error:",
            error
        );

        return res.status(500).json({
            error: "Failed to retrieve feed"
        });

    }

});


// ========================================
// HEALTH CHECK
// ========================================

app.get("/health", (req, res) => {

    res.json({

        name: "ByteWatch",

        status: "autonomous",

        description:
            "Autonomous AI Developer Advocate"

    });

});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log(
        `\n🚀 ByteWatch running on port ${PORT}`
    );

});