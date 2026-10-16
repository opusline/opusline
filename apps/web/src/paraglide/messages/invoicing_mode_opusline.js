/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Mode_OpuslineInputs */

const en_invoicing_mode_opusline = /** @type {(inputs: Invoicing_Mode_OpuslineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`In Opusline`)
};

const fr_invoicing_mode_opusline = /** @type {(inputs: Invoicing_Mode_OpuslineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dans Opusline`)
};

/**
* | output |
* | --- |
* | "In Opusline" |
*
* @param {Invoicing_Mode_OpuslineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_mode_opusline = /** @type {((inputs?: Invoicing_Mode_OpuslineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Mode_OpuslineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_mode_opusline(inputs)
	return en_invoicing_mode_opusline(inputs)
});