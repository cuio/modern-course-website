const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const functions = require("firebase-functions");

const https = require("https");
const admin = require("firebase-admin");
admin.initializeApp();
const db = getFirestore();

const cheerio = require("cheerio");

exports.cronJob = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async (context) => {
    https
      .get("https://legacy-course-website.vercel.app/", (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // - - - - - - PARSE DATA FROM LEGACY - - - - -
          const $ = cheerio.load(data);
          const rows = [];
          $("table tr").each((i, el) => {
            if (i > 0) {
              const cells = $(el).find("td");
              const row = [];
              cells.each((j, cell) => {
                row.push($(cell).text().trim());
              });
              rows.push(row);
            }
          });

          functions.logger.log("Updating DB", { hi: "hi" });

          // - - - - - - ADD DATA TO DB - - - - -

          rows.forEach(async (row) => {
            let [major, name, seats] = row;
            let collectionName = major.split(" ")[0];
            let documentName = major.split(" ")[1];
            let ref = db.collection(collectionName).doc(documentName);
            functions.logger.log("ADDING: ", {
              name: name,
              seats: seats,
            });
            await ref.set({
              name: name,
              seats: seats,
            });
          });
        });
      })
      .on("error", (err) => {
        console.error(err);
      });
  });
