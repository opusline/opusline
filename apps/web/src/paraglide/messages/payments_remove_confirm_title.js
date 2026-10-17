/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Payments_Remove_Confirm_TitleInputs */

const en_payments_remove_confirm_title = /** @type {(inputs: Payments_Remove_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove this payment?`)
};

const fr_payments_remove_confirm_title = /** @type {(inputs: Payments_Remove_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retirer ce paiement ?`)
};

/**
* | output |
* | --- |
* | "Remove this payment?" |
*
* @param {Payments_Remove_Confirm_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payments_remove_confirm_title = /** @type {((inputs?: Payments_Remove_Confirm_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payments_Remove_Confirm_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payments_remove_confirm_title(inputs)
	return en_payments_remove_confirm_title(inputs)
});