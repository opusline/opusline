/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Clients_Head_RevenueInputs */

const en_clients_head_revenue = /** @type {(inputs: Clients_Head_RevenueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Revenue ${i?.year}`)
};

const fr_clients_head_revenue = /** @type {(inputs: Clients_Head_RevenueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CA ${i?.year}`)
};

/**
* | output |
* | --- |
* | "Revenue {year}" |
*
* @param {Clients_Head_RevenueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_head_revenue = /** @type {((inputs: Clients_Head_RevenueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Head_RevenueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_head_revenue(inputs)
	return en_clients_head_revenue(inputs)
});