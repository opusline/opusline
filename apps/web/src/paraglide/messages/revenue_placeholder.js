/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_PlaceholderInputs */

const en_revenue_placeholder = /** @type {(inputs: Revenue_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenue tracking lands here — invoiced revenue, VAT collected, estimated net.`)
};

const fr_revenue_placeholder = /** @type {(inputs: Revenue_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le suivi des revenus arrive ici — CA facturé, TVA collectée, net estimé.`)
};

/**
* | output |
* | --- |
* | "Revenue tracking lands here — invoiced revenue, VAT collected, estimated net." |
*
* @param {Revenue_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_placeholder = /** @type {((inputs?: Revenue_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_placeholder(inputs)
	return en_revenue_placeholder(inputs)
});