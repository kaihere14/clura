import http from "node:http";
import { getApp } from "./app/app";

const server = http.createServer(getApp());

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
