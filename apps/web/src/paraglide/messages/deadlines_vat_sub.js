/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Deadlines_Vat_SubInputs */

const en_deadlines_vat_sub = /** @type {(inputs: Deadlines_Vat_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA collected ${i?.amount} · télérèglement impots.gouv.fr`)
};

const fr_deadlines_vat_sub = /** @type {(inputs: Deadlines_Vat_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA collectée ${i?.amount} · télérèglement impots.gouv.fr`)
};

/**
* | output |
* | --- |
* | "TVA collected {amount} · télérèglement impots.gouv.fr" |
*
* @param {Deadlines_Vat_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_vat_sub = /** @type {((inputs: Deadlines_Vat_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Vat_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_vat_sub(inputs)
	return en_deadlines_vat_sub(inputs)
});