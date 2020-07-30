import { downloadChisel } from "chisel-tunnel";
import { ChildService } from "child-service";

interface ReverseTunnelOptions {
	host: string;
	tunnelSpec: string;
}

export function reverseTunnel({ host, tunnelSpec }: ReverseTunnelOptions): ChildService {
	return new ChildService({
		command: downloadChisel("^1.6.0"),
		args: ["client", host + ":2222", tunnelSpec],
		readyRegex: / Connected /,
		listenOnStderr: true,
	});
}
