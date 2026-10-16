/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Client_IncompleteInputs */

const en_editor_client_incomplete = /** @type {(inputs: Editor_Client_IncompleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Details to complete on the client record`)
};

const fr_editor_client_incomplete = /** @type {(inputs: Editor_Client_IncompleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coordonnées à compléter dans la fiche client`)
};

/**
* | output |
* | --- |
* | "Details to complete on the client record" |
*
* @param {Editor_Client_IncompleteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_client_incomplete = /** @type {((inputs?: Editor_Client_IncompleteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Client_IncompleteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_client_incomplete(inputs)
	return en_editor_client_incomplete(inputs)
});