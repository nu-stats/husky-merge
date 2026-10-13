module.exports = {
  run: [{
    // The launcher itself, when it was installed from a git repository.
    when: "{{exists('.git')}}",
    method: "shell.run",
    params: {
      message: "git pull"
    }
  }, {
    method: "shell.run",
    params: {
      path: "app",
      message: "git pull"
    }
  }]
}
