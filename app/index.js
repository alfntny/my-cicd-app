const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send(
    "<h1>CI/CD Pipeline Working! 🚀</h1><p>Deployed via Jenkins → Kubernetes</p>",
  );
});

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
