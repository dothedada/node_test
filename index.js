import http from "http";
import path from "path";
import url from "url";
import fs from "fs/promises";

const file = {
  ".html": "text/html",
  ".txt": "text/plain",
  ".css": "text/css",
  ".javascript": "text/javascript",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

http
  .createServer(async (request, response) => {
    const fileURL = url.parse(request.url);
    const filePath =
      fileURL.path === "/"
        ? path.join("./", "index.html")
        : path.join("./", fileURL.path);

    try {
      const data = await fs.readFile(filePath);
      response.writeHead(200, { "content-type": file[path.extname(filePath)] });

      response.end(filePath);
    } catch (err) {
      if (err.code === "ENOENT") {
        response.writeHead(404, "file not found", {
          "content-type": "text/html",
        });
        const data = await fs.readFile("./error.html");
        response.end(data);
      }
      console.log(err);
    }
  })
  .listen(8000, () => {
    console.log("server launched at port 8000");
  });
