/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Detail_PlaceholderInputs */

const en_credit_note_detail_placeholder = /** @type {(inputs: Credit_Note_Detail_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`1 h of maintenance counted twice`)
};

const fr_credit_note_detail_placeholder = /** @type {(inputs: Credit_Note_Detail_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`1 h de maintenance comptée deux fois`)
};

/**
* | output |
* | --- |
* | "1 h of maintenance counted twice" |
*
* @param {Credit_Note_Detail_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_detail_placeholder = /** @type {((inputs?: Credit_Note_Detail_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Detail_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_detail_placeholder(inputs)
	return en_credit_note_detail_placeholder(inputs)
});