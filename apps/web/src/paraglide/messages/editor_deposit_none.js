/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Deposit_NoneInputs */

const en_editor_deposit_none = /** @type {(inputs: Editor_Deposit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No deposit`)
};

const fr_editor_deposit_none = /** @type {(inputs: Editor_Deposit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sans acompte`)
};

/**
* | output |
* | --- |
* | "No deposit" |
*
* @param {Editor_Deposit_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_deposit_none = /** @type {((inputs?: Editor_Deposit_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Deposit_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_deposit_none(inputs)
	return en_editor_deposit_none(inputs)
});