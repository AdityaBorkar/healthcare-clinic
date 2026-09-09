import { pm } from "../src/aspen/server";

await pm
	.$prepareInfra()
	.then(() => {
		console.log("Infra prepared successfully");
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});

// await pm
// 	.healthCheck()
// 	.then((result) => {
// 		console.log("HEALTHY", result);
// 		process.exit(0);
// 	})
// 	.catch((err) => {
// 		console.error(err);
// 		process.exit(1);
// 	});
