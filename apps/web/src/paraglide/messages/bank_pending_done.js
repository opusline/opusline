/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Pending_DoneInputs */

const en_bank_pending_done = /** @type {(inputs: Bank_Pending_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`everything is reconciled`)
};

const fr_bank_pending_done = /** @type {(inputs: Bank_Pending_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`tout est rapproché`)
};

/**
* | output |
* | --- |
* | "everything is reconciled" |
*
* @param {Bank_Pending_DoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_pending_done = /** @type {((inputs?: Bank_Pending_DoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Pending_DoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_pending_done(inputs)
	return en_bank_pending_done(inputs)
});