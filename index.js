import fs from "fs";
import path from "path";
import { tokenToId } from "./config.js";
import { PriceServiceConnection } from "@pythnetwork/price-service-client";

const connection = new PriceServiceConnection("https://hermes.pyth.network");

async function Pyth() {
	const marketPricesPyth = {};

	try {
		const prices = await connection.getLatestPriceFeeds(Object.values(tokenToId));

		for (const symbol in tokenToId) {
			const index = Object.keys(tokenToId).indexOf(symbol);

			const price = prices[index].price.price * 10 ** prices[index].price.expo;

			marketPricesPyth[symbol] = price;

			// console.log(`Symbol: ${symbol} -- ID: ${tokenToId[symbol]} -- Price: ${price}$`);
		}

		fs.writeFileSync(path.join("./prices.json"), JSON.stringify(marketPricesPyth, null, 2));
	} catch (error) {
		console.error(error);
	}
}

Pyth();
