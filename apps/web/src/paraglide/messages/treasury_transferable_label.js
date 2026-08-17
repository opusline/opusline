/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Transferable_LabelInputs */

const en_treasury_transferable_label = /** @type {(inputs: Treasury_Transferable_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Safe to transfer`)
};

const fr_treasury_transferable_label = /** @type {(inputs: Treasury_Transferable_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant virable en sécurité`)
};

/**
* | output |
* | --- |
* | "Safe to transfer" |
*
* @param {Treasury_Transferable_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_transferable_label = /** @type {((inputs?: Treasury_Transferable_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Transferable_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_transferable_label(inputs)
	return en_treasury_transferable_label(inputs)
});