/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Mode_Opusline_DetailInputs */

const en_invoicing_mode_opusline_detail = /** @type {(inputs: Invoicing_Mode_Opusline_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline numbers them, generates the PDF and sends it to the client. Reminders go out on their own.`)
};

const fr_invoicing_mode_opusline_detail = /** @type {(inputs: Invoicing_Mode_Opusline_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline numérote, génère le PDF et l'envoie au client. Les relances partent toutes seules.`)
};

/**
* | output |
* | --- |
* | "Opusline numbers them, generates the PDF and sends it to the client. Reminders go out on their own." |
*
* @param {Invoicing_Mode_Opusline_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_mode_opusline_detail = /** @type {((inputs?: Invoicing_Mode_Opusline_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Mode_Opusline_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_mode_opusline_detail(inputs)
	return en_invoicing_mode_opusline_detail(inputs)
});