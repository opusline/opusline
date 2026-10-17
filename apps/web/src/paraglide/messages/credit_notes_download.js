/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Credit_Notes_DownloadInputs */

const en_credit_notes_download = /** @type {(inputs: Credit_Notes_DownloadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Download credit note ${i?.number}`)
};

const fr_credit_notes_download = /** @type {(inputs: Credit_Notes_DownloadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Télécharger l'avoir ${i?.number}`)
};

/**
* | output |
* | --- |
* | "Download credit note {number}" |
*
* @param {Credit_Notes_DownloadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_notes_download = /** @type {((inputs: Credit_Notes_DownloadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Notes_DownloadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_notes_download(inputs)
	return en_credit_notes_download(inputs)
});