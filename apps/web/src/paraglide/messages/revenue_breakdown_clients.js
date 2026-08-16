/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Revenue_Breakdown_ClientsInputs */

const en_revenue_breakdown_clients = /** @type {(inputs: Revenue_Breakdown_ClientsInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} client`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} clients`);
	return /** @type {LocalizedString} */ ("revenue_breakdown_clients");
};

const fr_revenue_breakdown_clients = /** @type {(inputs: Revenue_Breakdown_ClientsInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} client`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} clients`);
	return /** @type {LocalizedString} */ ("revenue_breakdown_clients");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} client" |
* | "other" | "{count} clients" |
*
* @param {Revenue_Breakdown_ClientsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_breakdown_clients = /** @type {((inputs: Revenue_Breakdown_ClientsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Breakdown_ClientsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_breakdown_clients(inputs)
	return en_revenue_breakdown_clients(inputs)
});