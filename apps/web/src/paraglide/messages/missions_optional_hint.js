/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Optional_HintInputs */

const en_missions_optional_hint = /** @type {(inputs: Missions_Optional_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(optional)`)
};

const fr_missions_optional_hint = /** @type {(inputs: Missions_Optional_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(optionnel)`)
};

/**
* | output |
* | --- |
* | "(optional)" |
*
* @param {Missions_Optional_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_optional_hint = /** @type {((inputs?: Missions_Optional_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Optional_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_optional_hint(inputs)
	return en_missions_optional_hint(inputs)
});