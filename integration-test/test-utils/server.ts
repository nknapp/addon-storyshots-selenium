import handler from "serve-handler";
import http, { Server } from "http";

interface StaticFileServer {
	start(): Promise<void>;
	stop(): Promise<void>;
}

export function storybookStaticServer(listenPort: number): StaticFileServer {
	const server: Server = http.createServer((request, response) => {
		return handler(request, response, { public: "storybook-static", cleanUrls: false });
	});

	return {
		start() {
			const successPromise = new Promise<void>((resolve) => server.once("listening", resolve));
			const errorPromise = new Promise<void>((resolve, reject) => server.once("error", reject));
			server.listen(listenPort);
			return Promise.race([successPromise, errorPromise]);
		},
		stop() {
			const successPromise = new Promise<void>((resolve) => server.once("close", resolve));
			const errorPromise = new Promise<void>((resolve, reject) => server.once("error", reject));
			server.close();
			return Promise.race([successPromise, errorPromise]);
		},
	};
}
