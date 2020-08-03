import browserstack from "browserstack-local";
import createDebug from "debug";
import { createSectionDebug } from "../../src/utils/internal-utils";
const debug = createDebug("addon-storyshot-selenium:browserstack-tunnel");
const sectionDebug = createSectionDebug(debug);
const browserstackTunnel = new browserstack.Local();

export const tunnel = {
	async start(options: Partial<browserstack.Options> = {}): Promise<void> {
		return sectionDebug(
			"starting tunnel",
			() =>
				new Promise((resolve, reject) => {
					browserstackTunnel.start(options, (error) => {
						if (error != null) {
							return reject(error);
						}
						return resolve();
					});
				})
		);
	},
	async stop(): Promise<void> {
		return sectionDebug(
			"stopping tunnel",
			() => new Promise((resolve) => browserstackTunnel.stop(resolve))
		);
	},
};
