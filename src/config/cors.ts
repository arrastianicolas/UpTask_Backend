import { CorsOptions } from "cors";

export const corsConfing: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [process.env.FRONTEND_URL];

    if (process.argv[2] === "--api") {
      whiteList.push(undefined);
    }
    console.log("Origen:", origin);

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"), false);
    }
  },
};
