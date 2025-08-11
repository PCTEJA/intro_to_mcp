# MCP Modules 1 & 2: Foundations & Core Concepts

Welcome to the **foundational part** of our journey into the **Model Context Protocol (MCP)**. Before we write any code, it’s essential to understand the **“why” and “what”** behind MCP.

## Live Deployment

Click the image below to preview the application live!

[![Demo GIF](https://github.com/PCTEJA/intro_to_mcp/blob/main/Module%201%20%26%202/MCP_Video_1.gif)](https://intro-to-mcp.vercel.app/)

[Live Deployment: intro-to-mcp.vercel.app](https://intro-to-mcp.vercel.app/)

---

## Module 1: The Big Picture

### The Problem: A World of Custom Integrations

Imagine having a powerful AI assistant. You want it to:

- Check your calendar and schedule meetings
- Read your emails
- Update your Jira board
- Query your internal database

Before MCP, doing any of this meant building a **custom integration** for each service:

- Separate **auth flows**, **data formats**, and **error handling**
- Hours spent writing **glue code**
- Fragile systems—**one API change** breaks the chain
- **Scalability issues** as new tools and AIs are added
- Locked into **walled gardens** (e.g., a ChatGPT plugin won’t work with Claude)

---

### The Solution: MCP – A Universal Standard

Enter MCP: a **universal, open protocol** that defines a common way for AI models and tools to talk.

>  **Analogy**: Before USB, every device had a different plug. USB standardized it. MCP does the same for AI.

With MCP:
- One protocol connects **any AI** to **any service**
- No more custom integrations for every combo
- Developers build **once** for any compliant AI

**MCP is the USB-C for AI.**  
One protocol. Infinite integrations.

---

## Module 2: Core Concepts Explained

Before we build, let’s explore the **core architecture and components** of MCP, inspired by the success of the **Language Server Protocol (LSP)**.

---

### The Key Players: Host, Client, and Server

#### MCP Host
- **Definition**: The main application the user interacts with.
- **Examples**: VS Code, Claude Desktop, Cursor IDE, or your own web app.
- **Responsibilities**:
  - Manages one or more **clients**
  - Handles **security & lifecycle**
  - Orchestrates the **overall experience**

---

#### MCP Client
- **Definition**: Lives inside the host. Talks to a single MCP Server.
- **1-to-1 relationship** with an MCP Server.
- **Responsibilities**:
  - Receives AI intent (e.g., run a tool)
  - Formats the request in **JSON-RPC**
  - Sends it to the server
  - Waits for a response

---

#### MCP Server
- **Definition**: Wraps around an external tool or API and makes it accessible to AI.
- **Examples**:
  - GitHub API Server
  - File system server
  - SQL Database connector
- **Responsibilities**:
  - Expose capabilities (tools, resources, prompts)
  - Execute requests and return results

---

### The Capabilities: What a Server Can Offer

Each MCP server can expose **three types of capabilities**:

#### Tools
- **Definition**: Executable functions with side effects.
- **Example**: `sendMessage` → Posts to a Slack channel.
- **Analogy**: A **verb** — it does something.

---

#### Resources
- **Definition**: Readable, static or dynamic data used for context.
- **Example**: File contents, customer records.
- **Analogy**: A **noun** — it's something the AI can know.

---

#### Prompts
- **Definition**: Reusable instructions or task workflows for the AI.
- **Example**: `summarize_and_reply` → Summarizes an email and uses a tool to send a reply.
- **Analogy**: A **script or blueprint** — guiding more complex actions.

---

## Next Step: Build Your First MCP Server

Now that you’ve grasped the **fundamental concepts**, you're ready to:

Move on to [Module 3: Building Your First MCP Server](#)  
Where we’ll **write code**, **expose tools**, and test it in the real world!

---

**Tip**: Bookmark this section. These concepts will be your anchor throughout the rest of the journey.

---

**Continue Learning**  
→ [Return to Main README](../README.md)  
→ [Next Module: Your First MCP Server](./module-3.md)
