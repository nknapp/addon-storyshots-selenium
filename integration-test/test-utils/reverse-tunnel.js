import { downloadChisel } from "chisel-tunnel";
import { ChildService } from "child-service";

async function prepareTunnel() {
	const chiselExecutable = await downloadChisel("^1.6.0");
	const seleniumHost = process.env.SELENIUM_HOST || "localhost";

	return new ChildService({
		command: chiselExecutable,
		args: ["client", seleniumHost + ":2222", "R:9009:localhost:9009"],
		readyRegex: / Connected /,
		listenOnStderr: true,
	});
}

const tunnel = prepareTunnel();

export const reverseTunnel = {
	async start() {
		await (await tunnel).start();
		console.log("Tunnel started");
	},
	async stop() {
		return (await tunnel).stop();
	},
};
