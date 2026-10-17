/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Toggle_CloseInputs */

const en_paste_toggle_close = /** @type {(inputs: Paste_Toggle_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hide`)
};

const fr_paste_toggle_close = /** @type {(inputs: Paste_Toggle_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Masquer`)
};

/**
* | output |
* | --- |
* | "Hide" |
*
* @param {Paste_Toggle_CloseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_toggle_close = /** @type {((inputs?: Paste_Toggle_CloseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Toggle_CloseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_toggle_close(inputs)
	return en_paste_toggle_close(inputs)
});