import colors, { bgBlue } from "colors";
import server from "./server";

const port = process.env.PORT || 4500;

server.listen(port, () => {
  console.log(
    colors.cyan.bold(`REST API funcionando en http://localhost:${port}`)
  );
});
