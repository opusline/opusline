/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Mode_ElsewhereInputs */

const en_invoicing_mode_elsewhere = /** @type {(inputs: Invoicing_Mode_ElsewhereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`In another tool`)
};

const fr_invoicing_mode_elsewhere = /** @type {(inputs: Invoicing_Mode_ElsewhereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dans un autre outil`)
};

/**
* | output |
* | --- |
* | "In another tool" |
*
* @param {Invoicing_Mode_ElsewhereInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_mode_elsewhere = /** @type {((inputs?: Invoicing_Mode_ElsewhereInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Mode_ElsewhereInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_mode_elsewhere(inputs)
	return en_invoicing_mode_elsewhere(inputs)
});