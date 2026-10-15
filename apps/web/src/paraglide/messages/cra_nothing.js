/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_NothingInputs */

const en_cra_nothing = /** @type {(inputs: Cra_NothingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`none`)
};

const fr_cra_nothing = /** @type {(inputs: Cra_NothingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucun`)
};

/**
* | output |
* | --- |
* | "none" |
*
* @param {Cra_NothingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_nothing = /** @type {((inputs?: Cra_NothingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_NothingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_nothing(inputs)
	return en_cra_nothing(inputs)
});