/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Page_Intro_OpuslineInputs */

const en_invoices_page_intro_opusline = /** @type {(inputs: Invoices_Page_Intro_OpuslineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create, send and track your invoices.`)
};

const fr_invoices_page_intro_opusline = /** @type {(inputs: Invoices_Page_Intro_OpuslineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créez, envoyez et suivez vos factures.`)
};

/**
* | output |
* | --- |
* | "Create, send and track your invoices." |
*
* @param {Invoices_Page_Intro_OpuslineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_page_intro_opusline = /** @type {((inputs?: Invoices_Page_Intro_OpuslineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Page_Intro_OpuslineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_page_intro_opusline(inputs)
	return en_invoices_page_intro_opusline(inputs)
});