import "dotenv/config";
import http from "node:http";
import { getApp } from "./app/app";

const server = http.createServer(getApp());

server.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
