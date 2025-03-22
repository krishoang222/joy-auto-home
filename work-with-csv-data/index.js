import { parse } from "csv/sync";
import fs from "fs";
import { connectToDatabase } from "./db.js";

const input = fs.readFileSync("./input/migration_data.csv");

const records = parse(input, {
  // columns: true -> output as object with header
  fromLine: 2,
});
console.log({ records });
// fs.writeFileSync(`./output/output_json_from_csv_${new Date().toISOString()}.json`, JSON.stringify(records, null, 2), { flag: 'wx' })

const db = connectToDatabase();

records.forEach((row) => {
  // db.serialise ensure current executation finish before executing the next one
  db.serialize(() => {
    db.run(
      `INSERT INTO migration VALUES (?, ?, ? , ?, ?, ?, ?)`,
      [row[0], row[1], row[2], row[3], row[4], row[5], row[6]],
      function (error) {
        if (error) {
          return console.log(error.message);
        }
        console.log(`Inserted a row with the id: ${this.lastID}`);
      },
    );
  });
});
