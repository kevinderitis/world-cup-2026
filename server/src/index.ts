import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import healthRouter from "./routes/health";
import worldcupRouter from "./routes/worldcup";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

const clientDist = path.resolve(__dirname, "../../client/dist");

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/worldcup", worldcupRouter);

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(
    `World Cup Path server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`
  );
});

export default app;
