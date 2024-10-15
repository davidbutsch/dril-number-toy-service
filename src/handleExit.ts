import { Logger, httpServer } from "@/libs";

import promisify from "util.promisify";

const gracefulShutdown = async () => {
  try {
    Logger.info("Shutting down gracefully");

    await promisify(httpServer.close).bind(httpServer)();
    Logger.info("HTTP server closed");

    Logger.info("Exiting");
    process.exit(0);
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
};

const exitSignals = ["SIGHUP", "SIGINT", "SIGTERM"];

exitSignals.forEach((signal) => {
  process.on(signal, () => {
    Logger.info(`Received a ${signal} signal`);
    gracefulShutdown();
  });
});
