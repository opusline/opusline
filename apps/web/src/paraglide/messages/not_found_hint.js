/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Not_Found_HintInputs */

const en_not_found_hint = /** @type {(inputs: Not_Found_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This address leads nowhere — the link may be stale.`)
};

const fr_not_found_hint = /** @type {(inputs: Not_Found_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cette adresse ne mène nulle part — le lien est peut-être ancien.`)
};

/**
* | output |
* | --- |
* | "This address leads nowhere — the link may be stale." |
*
* @param {Not_Found_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const not_found_hint = /** @type {((inputs?: Not_Found_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Not_Found_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_not_found_hint(inputs)
	return en_not_found_hint(inputs)
});