/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Penalty_PlaceholderInputs */

const en_invoicing_penalty_placeholder = /** @type {(inputs: Invoicing_Penalty_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ECB rate + 10 points`)
};

const fr_invoicing_penalty_placeholder = /** @type {(inputs: Invoicing_Penalty_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux BCE + 10 points`)
};

/**
* | output |
* | --- |
* | "ECB rate + 10 points" |
*
* @param {Invoicing_Penalty_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_penalty_placeholder = /** @type {((inputs?: Invoicing_Penalty_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Penalty_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_penalty_placeholder(inputs)
	return en_invoicing_penalty_placeholder(inputs)
});