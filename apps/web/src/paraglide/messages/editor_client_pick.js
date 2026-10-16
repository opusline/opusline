/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Client_PickInputs */

const en_editor_client_pick = /** @type {(inputs: Editor_Client_PickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a client…`)
};

const fr_editor_client_pick = /** @type {(inputs: Editor_Client_PickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisir un client…`)
};

/**
* | output |
* | --- |
* | "Choose a client…" |
*
* @param {Editor_Client_PickInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_client_pick = /** @type {((inputs?: Editor_Client_PickInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Client_PickInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_client_pick(inputs)
	return en_editor_client_pick(inputs)
});