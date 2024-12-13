const express = require("express");
const cors = require("cors");
const postsRoutes = require("./routes/posts");

const app = express();

app.use(cors());
app.use(express.json());

app.use(postsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
