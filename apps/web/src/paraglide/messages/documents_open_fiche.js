/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Open_FicheInputs */

const en_documents_open_fiche = /** @type {(inputs: Documents_Open_FicheInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open the record`)
};

const fr_documents_open_fiche = /** @type {(inputs: Documents_Open_FicheInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir la fiche`)
};

/**
* | output |
* | --- |
* | "Open the record" |
*
* @param {Documents_Open_FicheInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_open_fiche = /** @type {((inputs?: Documents_Open_FicheInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Open_FicheInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_open_fiche(inputs)
	return en_documents_open_fiche(inputs)
});