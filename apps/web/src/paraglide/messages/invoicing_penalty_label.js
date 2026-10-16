/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Penalty_LabelInputs */

const en_invoicing_penalty_label = /** @type {(inputs: Invoicing_Penalty_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Late-payment penalties (% per year)`)
};

const fr_invoicing_penalty_label = /** @type {(inputs: Invoicing_Penalty_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pénalités de retard (% annuel)`)
};

/**
* | output |
* | --- |
* | "Late-payment penalties (% per year)" |
*
* @param {Invoicing_Penalty_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_penalty_label = /** @type {((inputs?: Invoicing_Penalty_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Penalty_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_penalty_label(inputs)
	return en_invoicing_penalty_label(inputs)
});