# AI Playground - MVP Prototype

This is a client-side Single Page Application (SPA) for browsing and playing AI-generated content.

## 🚀 How to Run (Local)

Because this project uses ES6 Modules and fetches external files (JSON/Three.js), strict browser security (CORS) prevents it from running directly by double-clicking `index.html`.

1. **Requirement:** Python (usually installed on macOS/Linux) or Node.js.
2. Open terminal in the `ai-playground` folder.
3. Run a simple server:
   * **Python 3:** `python3 -m http.server 8000`
   * **Node (http-server):** `npx http-server .`
4. Open `http://localhost:8000` in your browser.

## 🛠 Admin Guide: Publishing Content

There is **no public UI** for uploading. Content is curated by you (Admin).

### Bundle Structure
To create a new game/sim, create a folder (e.g., `my-game/`) with:
1. `manifest.json`: Configuration.
2. `index.js`: The Three.js logic.
3. `assets/`: (Optional) GLB models or textures.

**Example `manifest.json`**:
```json
{
  "id": "unique-id",
  "title": "My Physics Sim",
  "entry": "index.js",
  "runtime": { "cameraPosition": [0, 5, 10] }
}