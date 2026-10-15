/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Record_FailedInputs */

const en_treasury_record_failed = /** @type {(inputs: Treasury_Record_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The transfer could not be recorded.`)
};

const fr_treasury_record_failed = /** @type {(inputs: Treasury_Record_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le virement n'a pas pu être enregistré.`)
};

/**
* | output |
* | --- |
* | "The transfer could not be recorded." |
*
* @param {Treasury_Record_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_record_failed = /** @type {((inputs?: Treasury_Record_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Record_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_record_failed(inputs)
	return en_treasury_record_failed(inputs)
});