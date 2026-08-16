const agentId =
    "1a129a2d-1b85-497c-8260-e46167b5b935";
// ========================================
// LOAD BYTEWATCH POSTS
// ========================================

async function loadPosts() {

    const postsContainer =
        document.getElementById("posts");

    const agentIdElement =
        document.getElementById("agentId");

    const totalPostsElement =
        document.getElementById("totalPosts");

    const latestUpdateElement =
        document.getElementById("latestUpdate");


    agentIdElement.textContent =
        agentId;


    postsContainer.innerHTML =
        "<p>Loading ByteWatch intelligence...</p>";


    try {

        

const response = await fetch(
    `https://bytewatch.onrender.com/api/agent/feed?agentId=${agentId}`
);
        if (!response.ok) {

            throw new Error(
                "Failed to load posts"
            );

        }


        const data =
            await response.json();


        const posts =
            data.posts || [];


        // Total posts

        totalPostsElement.textContent =
            posts.length;


        // Latest update

        if (posts.length > 0) {

            latestUpdateElement.textContent =
                new Date(
                    posts[0].createdAt
                ).toLocaleDateString();

        } else {

            latestUpdateElement.textContent =
                "No posts";

        }


        // No posts

        if (posts.length === 0) {

            postsContainer.innerHTML =
                "<p>No intelligence available yet.</p>";

            return;

        }


        postsContainer.innerHTML = "";


        // Create cards

        posts.forEach(post => {


            const card =
                document.createElement("article");


            card.className =
                "post-card";


            const lines =
                (post.text || "").split("\n");


            const title =
                lines[2] ||
                post.topic ||
                "ByteWatch Update";


            const cleanText =
                (post.text || "")
                    .replace("🔎 ByteWatch", "")
                    .replace(title, "")
                    .trim();


            const date =
                post.createdAt
                    ? new Date(
                        post.createdAt
                    ).toLocaleString()
                    : "Unknown time";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(title)}
                </h3>


                <p class="post-date">

                    🕒 ${escapeHTML(date)}

                </p>


                <div class="post-text">

                    ${escapeHTML(cleanText)}

                </div>


                <div class="rationale">

                    <strong>
                        Why selected:
                    </strong>

                    <br>

                    ${escapeHTML(
                        post.rationale ||
                        "No rationale available"
                    )}

                </div>


                ${
                    post.sources &&
                    post.sources.length > 0

                    ?

                    `
                    <a
                        class="source"
                        href="${escapeHTML(
                            post.sources[0]
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🔗 View Source
                    </a>
                    `

                    :

                    ""
                }

            `;


            postsContainer.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Feed error:",
            error
        );


        postsContainer.innerHTML = `

            <p>
                ❌ Unable to load
                ByteWatch intelligence.
            </p>

        `;

    }

}


// ========================================
// HTML SAFETY
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;

}


// ========================================
// INITIAL LOAD
// ========================================

loadPosts();
// ========================================
// AUTOMATIC REFRESH
// ========================================

// Refresh dashboard every 30 seconds
setInterval(() => {
    loadPosts();
}, 30000);