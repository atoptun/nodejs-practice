import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getRootDir = () => {
  return path.join(__dirname, "..", "..");
};

export const getDataDir = () => {
  return path.join(getRootDir(), "data");
};
