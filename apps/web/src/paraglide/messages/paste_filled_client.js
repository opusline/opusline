/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Paste_Filled_ClientInputs */

const en_paste_filled_client = /** @type {(inputs: Paste_Filled_ClientInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Client: ${i?.name}`)
};

const fr_paste_filled_client = /** @type {(inputs: Paste_Filled_ClientInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Client : ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Client: {name}" |
*
* @param {Paste_Filled_ClientInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_filled_client = /** @type {((inputs: Paste_Filled_ClientInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Filled_ClientInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_filled_client(inputs)
	return en_paste_filled_client(inputs)
});