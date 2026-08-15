/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Billed_ToInputs */

const en_missions_billed_to = /** @type {(inputs: Missions_Billed_ToInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billed to`)
};

const fr_missions_billed_to = /** @type {(inputs: Missions_Billed_ToInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturé à`)
};

/**
* | output |
* | --- |
* | "Billed to" |
*
* @param {Missions_Billed_ToInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_billed_to = /** @type {((inputs?: Missions_Billed_ToInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Billed_ToInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_billed_to(inputs)
	return en_missions_billed_to(inputs)
});