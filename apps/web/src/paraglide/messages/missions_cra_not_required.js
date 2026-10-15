/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Cra_Not_RequiredInputs */

const en_missions_cra_not_required = /** @type {(inputs: Missions_Cra_Not_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CRA not required`)
};

const fr_missions_cra_not_required = /** @type {(inputs: Missions_Cra_Not_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CRA non requis`)
};

/**
* | output |
* | --- |
* | "CRA not required" |
*
* @param {Missions_Cra_Not_RequiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_cra_not_required = /** @type {((inputs?: Missions_Cra_Not_RequiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Cra_Not_RequiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_cra_not_required(inputs)
	return en_missions_cra_not_required(inputs)
});