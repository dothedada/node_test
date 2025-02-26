import http from "http";
import path from "path";
import url from "url";
import fs from "fs/promises";

const file = {
  ".html": "text/html",
  ".txt": "text/plain",
  ".css": "text/css",
  ".js": "text/javascript",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

const server = http.createServer(async (request, response) => {
  const fileURL = url.parse(request.url);
  const filePath =
    fileURL.path === "/"
      ? path.join("./public/", "index.html")
      : path.join("./public/", fileURL.path);

  try {
    const data = await fs.readFile(filePath);
    response.writeHead(200, { "content-type": file[path.extname(filePath)] });
    response.end(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      response.writeHead(404, "file not found", {
        "content-type": "text/html",
      });
      const data = await fs.readFile("./public/404.html");
      response.write(data);
    }
    console.log(err);
    response.end();
  }
});

server.listen(8080, () => {
  console.log("\n+++++++++++++++++++\nserver launched at port 8080");
});
