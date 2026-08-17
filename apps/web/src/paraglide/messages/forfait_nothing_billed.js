/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Forfait_Nothing_BilledInputs */

const en_forfait_nothing_billed = /** @type {(inputs: Forfait_Nothing_BilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No instalment issued yet.`)
};

const fr_forfait_nothing_billed = /** @type {(inputs: Forfait_Nothing_BilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune échéance émise pour le moment.`)
};

/**
* | output |
* | --- |
* | "No instalment issued yet." |
*
* @param {Forfait_Nothing_BilledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const forfait_nothing_billed = /** @type {((inputs?: Forfait_Nothing_BilledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forfait_Nothing_BilledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_forfait_nothing_billed(inputs)
	return en_forfait_nothing_billed(inputs)
});