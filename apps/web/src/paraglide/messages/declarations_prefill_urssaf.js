/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Prefill_UrssafInputs */

const en_declarations_prefill_urssaf = /** @type {(inputs: Declarations_Prefill_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pre-fill on autoentrepreneur.urssaf.fr`)
};

const fr_declarations_prefill_urssaf = /** @type {(inputs: Declarations_Prefill_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pré-remplir sur autoentrepreneur.urssaf.fr`)
};

/**
* | output |
* | --- |
* | "Pre-fill on autoentrepreneur.urssaf.fr" |
*
* @param {Declarations_Prefill_UrssafInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_prefill_urssaf = /** @type {((inputs?: Declarations_Prefill_UrssafInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Prefill_UrssafInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_prefill_urssaf(inputs)
	return en_declarations_prefill_urssaf(inputs)
});