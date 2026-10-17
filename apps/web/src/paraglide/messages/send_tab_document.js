/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Tab_DocumentInputs */

const en_send_tab_document = /** @type {(inputs: Send_Tab_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Document`)
};

const fr_send_tab_document = /** @type {(inputs: Send_Tab_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Document`)
};

/**
* | output |
* | --- |
* | "Document" |
*
* @param {Send_Tab_DocumentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_tab_document = /** @type {((inputs?: Send_Tab_DocumentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Tab_DocumentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_tab_document(inputs)
	return en_send_tab_document(inputs)
});