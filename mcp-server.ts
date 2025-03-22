import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Robert testar",
  version: "1.0.0"
});

// Add an addition tool
server.tool("add",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

// Add an addition tool
server.tool("summarize-and-remember-conversation", "Summarize the current conversation and remember it",
  { summary: z.string({
    description: "A summary of the current conversation", 
    message: 'You must provide a summary of the current conversation', 
    required_error: 'You must provide a summary of the current conversation' }) },
  async ({ summary }) => {
    // todo: actually save it somewhere
    return ({
      content: [{ type: "text", text: "I've remembered that, thanks! This is the summary: " + summary }]
    })
  } 
);

// Add a dynamic greeting resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [{
      uri: uri.href,
      text: `Hello, ${name}!`
    }]
  })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);