/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Quote_Preview_Pick_ClientInputs */

const en_editor_quote_preview_pick_client = /** @type {(inputs: Editor_Quote_Preview_Pick_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a client to see the quote.`)
};

const fr_editor_quote_preview_pick_client = /** @type {(inputs: Editor_Quote_Preview_Pick_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisissez un client pour voir le devis.`)
};

/**
* | output |
* | --- |
* | "Choose a client to see the quote." |
*
* @param {Editor_Quote_Preview_Pick_ClientInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_quote_preview_pick_client = /** @type {((inputs?: Editor_Quote_Preview_Pick_ClientInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Quote_Preview_Pick_ClientInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_quote_preview_pick_client(inputs)
	return en_editor_quote_preview_pick_client(inputs)
});