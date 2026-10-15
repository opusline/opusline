/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Head_Revenue_ShortInputs */

const en_clients_head_revenue_short = /** @type {(inputs: Clients_Head_Revenue_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenue`)
};

const fr_clients_head_revenue_short = /** @type {(inputs: Clients_Head_Revenue_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA`)
};

/**
* | output |
* | --- |
* | "Revenue" |
*
* @param {Clients_Head_Revenue_ShortInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_head_revenue_short = /** @type {((inputs?: Clients_Head_Revenue_ShortInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Head_Revenue_ShortInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_head_revenue_short(inputs)
	return en_clients_head_revenue_short(inputs)
});