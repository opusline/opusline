/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Editor_Deposit_RateInputs */

const en_editor_deposit_rate = /** @type {(inputs: Editor_Deposit_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.rate} % of the total incl. VAT`)
};

const fr_editor_deposit_rate = /** @type {(inputs: Editor_Deposit_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.rate} % du total TTC`)
};

/**
* | output |
* | --- |
* | "{rate} % of the total incl. VAT" |
*
* @param {Editor_Deposit_RateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_deposit_rate = /** @type {((inputs: Editor_Deposit_RateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Deposit_RateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_deposit_rate(inputs)
	return en_editor_deposit_rate(inputs)
});