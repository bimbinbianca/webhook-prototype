import express from 'express'

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());

// Add support for GET requests to your webhook
app.get("/webhook", (req, res) => {

// Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === config.verifyToken) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

app.post("/webhook", (req, res) => {
    try {
      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value && value.messages && value.messages.length > 0) {
        const namaPengirim = value.contacts?.[0]?.profile?.name || "Tanpa Nama";
        const nomorPengirim = value.messages[0].from;
        const jenisPesan = value.messages[0].type;

        const isiPesan = jenisPesan === "text" ? value.messages[0].text.body : "[Bukan pesan teks]";
        const nomorPenerima = value.metadata?.display_phone_number;

        console.log(`Pesan dari ${namaPengirim} (${nomorPengirim}): ${isiPesan}`);
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Error parsing webhook:", error);
      res.sendStatus(200);
    }
});