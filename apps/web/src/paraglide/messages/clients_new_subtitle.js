/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_New_SubtitleInputs */

const en_clients_new_subtitle = /** @type {(inputs: Clients_New_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The type determines who appears on the invoice and whether a CRA is expected.`)
};

const fr_clients_new_subtitle = /** @type {(inputs: Clients_New_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le type détermine qui figure sur la facture et si un CRA est attendu.`)
};

/**
* | output |
* | --- |
* | "The type determines who appears on the invoice and whether a CRA is expected." |
*
* @param {Clients_New_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_new_subtitle = /** @type {((inputs?: Clients_New_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_New_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_new_subtitle(inputs)
	return en_clients_new_subtitle(inputs)
});