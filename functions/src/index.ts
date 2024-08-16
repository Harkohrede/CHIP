import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";

admin.initializeApp();
const db = admin.firestore();
const app = express();

app.use(express.json());

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = db.collection("links").doc(id);
    const doc = await docRef.get();

    if (doc.exists) {
      const data = doc.data();
      const longUrl = data?.LongUrl;

      if (longUrl) {
        res.redirect(longUrl);
      } else {
        res.status(404).send("Long URL not found.");
      }
    } else {
      res.status(404).send("Short URL not found.");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error.");
  }
});

export const api = functions.https.onRequest(app);
