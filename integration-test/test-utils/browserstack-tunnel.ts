import browserstack from "browserstack-local";
import createDebug from "debug";
import { addDebugLogAllMethods } from "../../src/lib/class-debug";
const debug = createDebug("addon-storyshot-selenium:browserstack-tunnel");
const browserstackTunnel = new browserstack.Local();

export const tunnel = addDebugLogAllMethods(debug, "browserstack-local", {
	async start(options: Partial<browserstack.Options> = {}): Promise<void> {
		return new Promise((resolve, reject) => {
			browserstackTunnel.start(options, (error) => {
				if (error != null) {
					return reject(error);
				}
				return resolve();
			});
		});
	},
	async stop(): Promise<void> {
		return new Promise((resolve) => browserstackTunnel.stop(resolve));
	},
});
