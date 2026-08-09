import { runAgent } from "./agent.js";

let schedulerStarted = false;

export function startScheduler(agent) {

    if (schedulerStarted) {
        console.log("⚠️ Scheduler already running");
        return;
    }

    schedulerStarted = true;

    console.log("🤖 ByteWatch autonomous scheduler started");

    // First cycle after 10 seconds
    setTimeout(async () => {

        console.log("🚀 Starting first autonomous cycle...");

        await runAgent(agent);

        console.log("✅ First autonomous cycle finished");

    }, 10000);


    // Every 1 minute
    setInterval(async () => {

        console.log("\n⏰ 1 minute reached!");
        console.log("🚀 Starting scheduled autonomous cycle...");

        await runAgent(agent);

        console.log("✅ Scheduled autonomous cycle finished");

    }, 30 * 60 * 1000);
}