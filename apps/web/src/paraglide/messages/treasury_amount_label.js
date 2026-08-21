/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Amount_LabelInputs */

const en_treasury_amount_label = /** @type {(inputs: Treasury_Amount_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount`)
};

const fr_treasury_amount_label = /** @type {(inputs: Treasury_Amount_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant`)
};

/**
* | output |
* | --- |
* | "Amount" |
*
* @param {Treasury_Amount_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_amount_label = /** @type {((inputs?: Treasury_Amount_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Amount_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_amount_label(inputs)
	return en_treasury_amount_label(inputs)
});