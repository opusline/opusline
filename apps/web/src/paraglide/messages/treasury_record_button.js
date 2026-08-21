/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Record_ButtonInputs */

const en_treasury_record_button = /** @type {(inputs: Treasury_Record_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record a transfer`)
};

const fr_treasury_record_button = /** @type {(inputs: Treasury_Record_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer un virement`)
};

/**
* | output |
* | --- |
* | "Record a transfer" |
*
* @param {Treasury_Record_ButtonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_record_button = /** @type {((inputs?: Treasury_Record_ButtonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Record_ButtonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_record_button(inputs)
	return en_treasury_record_button(inputs)
});