module.exports = {
  run: [
    // Husky Merge lives in the Husky Eye View repository. Only the parts it
    // uses are checked out (sparse): the app page, its scripts and modules,
    // and the Census data it merges with (about 200 MB).
    {
      method: "shell.run",
      params: {
        message: [
          "git clone --depth 1 --filter=blob:none --sparse https://github.com/nu-stats/husky-eye-view app",
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [
          "git sparse-checkout set husky-merge scripts src public/context/tracts-2020 public/context/county-life-expectancy public/context/states public/context/life-expectancy public/context/segregation public/context/holc public/context/enumeration-districts-1900 public/context/enumeration-districts-1910 public/context/enumeration-districts-1920 public/context/enumeration-districts-1930"
        ]
      }
    },
    {
      method: "notify",
      params: {
        html: "Click the 'start' tab to get started!"
      }
    }
  ]
}
