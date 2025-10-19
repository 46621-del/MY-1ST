 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/data.js b/data.js
new file mode 100644
index 0000000000000000000000000000000000000000..7f02ba2f1b900cb0744bdb00334b5229ce1886b5
--- /dev/null
+++ b/data.js
@@ -0,0 +1,70 @@
+const KNOWLEDGE_BASE = [
+  {
+    id: "overview",
+    title: "Project overview",
+    keywords: ["overview", "project", "summary", "goal", "purpose"],
+    response:
+      "This project demonstrates a custom-data chatbot built with HTML, CSS, and JavaScript. It focuses on delivering quick answers about project planning, milestones, and resources without relying on external APIs."
+  },
+  {
+    id: "features",
+    title: "Key features",
+    keywords: ["feature", "ability", "function", "what can"],
+    response:
+      "The chatbot understands common project questions, highlights important resources, suggests follow-up topics, and keeps a beautifully organized layout that is easy to extend with your own content."
+  },
+  {
+    id: "data",
+    title: "Custom data",
+    keywords: ["data", "faq", "custom", "dataset", "information"],
+    response:
+      "All knowledge lives inside the data.js file. Add or edit entries in the KNOWLEDGE_BASE array to teach the chatbot new answers. Each entry accepts an id, title, list of keywords, and the response text."
+  },
+  {
+    id: "tech",
+    title: "Technology stack",
+    keywords: ["tech", "technology", "stack", "html", "css", "javascript"],
+    response:
+      "The chatbot runs entirely on the front-end using semantic HTML for structure, modern CSS for styling, and vanilla JavaScript for the conversation logic. No frameworks are required."
+  },
+  {
+    id: "customize",
+    title: "Customization",
+    keywords: ["custom", "theme", "color", "style", "layout"],
+    response:
+      "Tweak the colors or layout by updating styles.css. You can also customize the avatars, animation speed, or even attach real project data by modifying script.js to fetch from your own endpoints."
+  },
+  {
+    id: "usage",
+    title: "How to use",
+    keywords: ["how", "use", "start", "instructions", "guide"],
+    response:
+      "Type a question in the input field and press Send. The chatbot will search for the best answer in its knowledge base. If it cannot find a perfect match, it suggests related topics you can explore."
+  },
+  {
+    id: "roadmap",
+    title: "Roadmap",
+    keywords: ["roadmap", "next", "future", "plan", "milestone"],
+    response:
+      "Recommended next steps include connecting real data sources, improving the matching algorithm with fuzzy search, and deploying the chatbot on a static hosting platform."
+  },
+  {
+    id: "team",
+    title: "Team",
+    keywords: ["team", "members", "people", "contact", "who"],
+    response:
+      "This demo assumes a small project team with a product lead, designer, and developer. Adapt the response to describe your real collaborators and communication channels."
+  },
+  {
+    id: "support",
+    title: "Support",
+    keywords: ["support", "help", "issue", "trouble", "bug"],
+    response:
+      "If users encounter any issues, encourage them to check the README for setup instructions or reach out to the project maintainer via email or chat."
+  }
+];
+
+const DEFAULT_SUGGESTIONS = KNOWLEDGE_BASE.map((entry) => ({
+  id: entry.id,
+  title: entry.title
+}));
 
EOF
)
