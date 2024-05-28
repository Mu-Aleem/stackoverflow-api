import app from "./app.js";
import connectDB from "./config/db.js";

const startServer = async () => {
  // Connect database
  await connectDB();
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
};

startServer();
