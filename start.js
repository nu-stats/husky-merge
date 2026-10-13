module.exports = {
  // By setting daemon: true, the script keeps running even after all items in the `run` array finishes running. Mandatory for launching servers.
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        path: "app",
        // A small Node server for the app's own files, on 127.0.0.1 only.
        // No npm packages are needed.
        message: [
          "node scripts/husky-merge.mjs serve --port {{port}}"
        ],
        on: [{
          // The server prints "[Husky Merge] Ready at http://127.0.0.1:<port>/".
          "event": "/(http:\\/\\/[0-9.:]+)/",
          "done": true
        }]
      }
    },
    {
      // This step sets the local variable 'url', used in pinokio.js to show "Open Husky Merge".
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
      }
    }
  ]
}
