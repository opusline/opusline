/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_DepositInputs */

const en_editor_deposit = /** @type {(inputs: Editor_DepositInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deposit on acceptance`)
};

const fr_editor_deposit = /** @type {(inputs: Editor_DepositInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acompte à la signature`)
};

/**
* | output |
* | --- |
* | "Deposit on acceptance" |
*
* @param {Editor_DepositInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_deposit = /** @type {((inputs?: Editor_DepositInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_DepositInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_deposit(inputs)
	return en_editor_deposit(inputs)
});