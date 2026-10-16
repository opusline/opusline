/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Invoicing_Penalty_StatutoryInputs */

const en_invoicing_penalty_statutory = /** @type {(inputs: Invoicing_Penalty_StatutoryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ECB + 10 points · ${i?.rate} %`)
};

const fr_invoicing_penalty_statutory = /** @type {(inputs: Invoicing_Penalty_StatutoryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`BCE + 10 points · ${i?.rate} %`)
};

/**
* | output |
* | --- |
* | "ECB + 10 points · {rate} %" |
*
* @param {Invoicing_Penalty_StatutoryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_penalty_statutory = /** @type {((inputs: Invoicing_Penalty_StatutoryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Penalty_StatutoryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_penalty_statutory(inputs)
	return en_invoicing_penalty_statutory(inputs)
});