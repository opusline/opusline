/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_RecordInputs */

const en_treasury_record = /** @type {(inputs: Treasury_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record a transfer`)
};

const fr_treasury_record = /** @type {(inputs: Treasury_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer un virement`)
};

/**
* | output |
* | --- |
* | "Record a transfer" |
*
* @param {Treasury_RecordInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_record = /** @type {((inputs?: Treasury_RecordInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_RecordInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_record(inputs)
	return en_treasury_record(inputs)
});