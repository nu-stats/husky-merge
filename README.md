# Husky Merge

Husky Eye View's **Merge & Export** as an app of its own: convert a data file, or merge it with census data, and download the result with everything needed to **replicate the merge** — a Stata do-file, an R script, a plain-language description of every step, a codebook and the input files the scripts rebuild it from.

**Use it online:** <https://nu-stats.github.io/husky-eye-view/husky-merge/> — or install it in Pinokio from this repository (<https://github.com/nu-stats/husky-merge>). The app's code is in [Husky Eye View](https://github.com/nu-stats/husky-eye-view) (`husky-merge/`, `src/analysis/`).

It runs in your browser. Your files are read and merged on your computer and never leave it; the only things fetched are the app's own Census files (and the page's font).

## What it does

**Convert a file** — CSV, Excel (.xlsx), Stata (.dta, versions 113–119), SPSS (.sav, .zsav), R (.RData, .rds), GeoJSON or a zipped shapefile, saved as CSV, Excel, Stata, SPSS, R or a shapefile. Variable labels, value labels, missing values and dates are kept.

**Merge with census data** — your file is matched by its census IDs (GEOIDs or FIPS codes, leading zeros Excel dropped included, or separate state / county / tract columns) or by latitude / longitude:

- same level: tracts to tract data, counties to county data;
- larger areas: a tract takes its county's and state's values;
- smaller areas: a county file given tract data becomes **one row per tract in each county**, every row keeping the county's values (a state file likewise, per county or tract);
- mixed files (tracts and counties in one column): each row is matched at its own level (`hev_level`);
- points: the tract, county, state and city each point is in, its 1930s HOLC grade and 1900–1930 enumeration district — or count the points per tract, county or state;
- cities: city segregation, and county data from the county the city's center is in;
- a second file of your own, by any shared column.

The data: ACS 2020–24 (poverty, income, education, race and ethnicity, foreign-born, internet…), life expectancy (USALEEP tracts, IHME counties), air quality and park access, segregation indices, HOLC maps (Mapping Inequality, CC BY-NC-SA 4.0) and historical enumeration districts. Each source keeps its own terms; restricted research data is never included.

**The download** is a ZIP:

| File | What it is |
|---|---|
| `<name>_merged.<ext>` | the merged data, in the format you chose (or a shapefile with your file's own geography) |
| `<name>_merge.do` | a Stata 14+ do-file that rebuilds it from `inputs/` and checks every variable (counts, sums, row-weighted sums; `cf` against the .dta) |
| `<name>_merge.R` | the same in base R |
| `<name>_steps.txt` | every step in words, with its numbers |
| `codebook.csv` | every variable: name, original name, label, type, codes, source, years |
| `inputs/` | your file as read (and the original), the census data for exactly the areas used, and any lookups (tracts in each county, where each point fell) |

Run either script from the unzipped folder; it stops with an error unless the rebuilt data matches the delivered file.

## How to use it

1. **Install**, then **Start** in Pinokio, and click **Open Husky Merge**.
2. Choose **Convert a file** or **Merge with the map's data**.
3. Choose your file. It appears on the map (drag to pan, scroll to zoom, hover an area for its value; shade it by any column).
4. To merge: optionally add a second file of yours, tick the census data to add, **ADD THE DATA**, then pick a format and **DOWNLOAD**.

**Update** pulls the latest Husky Merge; **Reset** removes the installed copy (the `app` folder).

## API

### Command line (no browser)

The same engine, from the installed `app` folder:

```bash
node app/scripts/merge-export.mjs my_counties.csv --add tract:poverty,county:life-expectancy --format dta
node app/scripts/merge-export.mjs survey.sav --convert --format rdata --codebook
node app/scripts/merge-export.mjs my_counties.csv --list
```

### JavaScript (Node 20+)

```js
import { readFileSync, writeFileSync } from 'node:fs';
import { MergeSession } from './app/src/analysis/mergeSession.js';

const session = new MergeSession({
  readContext: (p) => readFileSync(`./app/public/${p}`, 'utf8'),
  appName: 'Husky Merge',
});
await session.open('clinics.csv', readFileSync('clinics.csv'));
await session.attach(['tract:poverty', 'county:life-expectancy']);
const zip = await session.exportMerged('dta'); // data + do-file + R script + steps
writeFileSync(zip.fileName, zip.bytes);
```

### Python

```python
import subprocess
subprocess.run(["node", "app/scripts/merge-export.mjs", "my_counties.csv",
                "--add", "tract:poverty", "--format", "dta"], check=True)
```

### curl

While Husky Merge is running, its Census files are served at the address Pinokio shows (for example `http://127.0.0.1:42003`):

```bash
curl http://127.0.0.1:42003/context/states/states.geojsonl
curl http://127.0.0.1:42003/context/tracts-2020/25025.geojsonl
```

## Web version

The online version is the same app, published to GitHub Pages from the Husky Eye View repository on every change. `node app/scripts/husky-merge.mjs build` writes it as a static site (`dist-husky-merge/`, about 200 MB) for any other web host.
