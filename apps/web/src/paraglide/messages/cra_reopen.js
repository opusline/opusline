/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_ReopenInputs */

const en_cra_reopen = /** @type {(inputs: Cra_ReopenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reopen`)
};

const fr_cra_reopen = /** @type {(inputs: Cra_ReopenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rouvrir`)
};

/**
* | output |
* | --- |
* | "Reopen" |
*
* @param {Cra_ReopenInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_reopen = /** @type {((inputs?: Cra_ReopenInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_ReopenInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_reopen(inputs)
	return en_cra_reopen(inputs)
});