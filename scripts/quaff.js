import { load } from "quaff";
import fs from "fs-extra";

const data = await load("./src/data/");

await fs.outputJson("./src/data/data.json", data, { spaces: 2 });
