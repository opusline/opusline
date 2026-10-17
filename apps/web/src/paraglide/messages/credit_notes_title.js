/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Notes_TitleInputs */

const en_credit_notes_title = /** @type {(inputs: Credit_Notes_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Credit notes`)
};

const fr_credit_notes_title = /** @type {(inputs: Credit_Notes_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avoirs`)
};

/**
* | output |
* | --- |
* | "Credit notes" |
*
* @param {Credit_Notes_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_notes_title = /** @type {((inputs?: Credit_Notes_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Notes_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_notes_title(inputs)
	return en_credit_notes_title(inputs)
});