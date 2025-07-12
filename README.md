# memo-mcp

`memo-mcp` is an MCP (Model Context Protocol) server that enables agents to record, search, and retrieve memos using [LowDB](https://github.com/typicode/lowdb) as a lightweight local database.

This server stores memo contents in a local JSON file and provides comprehensive memo management functionality including creation, updates, search, and retrieval operations. All data is persisted locally using LowDB, making it ideal for personal memo management without requiring external database dependencies.

## Features

The main tools provided by `memo-mcp` are as follows:

| Tool Name   | Description                     |
| ----------- | ------------------------------- |
| createMemo  | Create a new memo               |
| getMemos    | Retrieve all memos              |
| getMemo     | Retrieve a memo by specified ID |
| updateMemo  | Update a memo by specified ID   |
| deleteMemo  | Delete a memo by specified ID   |
| searchMemos | Search memos by keyword         |

## Usage

`DB_PATH` is optional. (default: `db.json`)

```json
{
  "mcpServers": {
    "memo-mcp": {
      "command": "npx",
      "args": ["-y", "memo-mcp"],
      "env": {
        "DB_PATH": "path/to/json_file.json"
      }
    }
  }
}
```

### VS Code Installation Instructions

For quick installation, use one of the one-click installation buttons below:

[![Install with NPX in VS Code](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=memo-mcp&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22memo-mcp%22%5D%7D)

For manual installation, add the following JSON block to your User Settings (JSON) file in VS Code. You can do this by pressing `Ctrl + Shift + P` and typing `Preferences: Open Settings (JSON)`.

Optionally, you can add it to a file called `.vscode/mcp.json` in your workspace. This will allow you to share the configuration with others.

```json
{
  "servers": {
    "canary": {
      "command": "npx",
      "args": ["-y", "memo-mcp"]
    }
  }
}
```
