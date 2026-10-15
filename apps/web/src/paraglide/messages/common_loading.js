/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_LoadingInputs */

const en_common_loading = /** @type {(inputs: Common_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading…`)
};

const fr_common_loading = /** @type {(inputs: Common_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chargement…`)
};

/**
* | output |
* | --- |
* | "Loading…" |
*
* @param {Common_LoadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_loading = /** @type {((inputs?: Common_LoadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_LoadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_loading(inputs)
	return en_common_loading(inputs)
});