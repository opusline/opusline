/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Dialog_TitleInputs */

const en_treasury_dialog_title = /** @type {(inputs: Treasury_Dialog_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record a transfer`)
};

const fr_treasury_dialog_title = /** @type {(inputs: Treasury_Dialog_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer un virement`)
};

/**
* | output |
* | --- |
* | "Record a transfer" |
*
* @param {Treasury_Dialog_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_dialog_title = /** @type {((inputs?: Treasury_Dialog_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Dialog_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_dialog_title(inputs)
	return en_treasury_dialog_title(inputs)
});