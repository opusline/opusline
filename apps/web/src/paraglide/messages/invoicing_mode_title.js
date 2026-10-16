/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Mode_TitleInputs */

const en_invoicing_mode_title = /** @type {(inputs: Invoicing_Mode_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Where do you write your invoices and quotes?`)
};

const fr_invoicing_mode_title = /** @type {(inputs: Invoicing_Mode_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Où éditez-vous vos factures et devis ?`)
};

/**
* | output |
* | --- |
* | "Where do you write your invoices and quotes?" |
*
* @param {Invoicing_Mode_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_mode_title = /** @type {((inputs?: Invoicing_Mode_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Mode_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_mode_title(inputs)
	return en_invoicing_mode_title(inputs)
});