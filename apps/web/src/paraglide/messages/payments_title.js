/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Payments_TitleInputs */

const en_payments_title = /** @type {(inputs: Payments_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payments`)
};

const fr_payments_title = /** @type {(inputs: Payments_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paiements`)
};

/**
* | output |
* | --- |
* | "Payments" |
*
* @param {Payments_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payments_title = /** @type {((inputs?: Payments_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payments_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payments_title(inputs)
	return en_payments_title(inputs)
});