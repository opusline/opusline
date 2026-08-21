/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Reference_Rate_HintInputs */

const en_missions_reference_rate_hint = /** @type {(inputs: Missions_Reference_Rate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Values tracked time so you can follow the fixed price's margin. It appears on no invoice.`)
};

const fr_missions_reference_rate_hint = /** @type {(inputs: Missions_Reference_Rate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valorise le temps saisi pour suivre la marge du forfait. N'apparaît sur aucune facture.`)
};

/**
* | output |
* | --- |
* | "Values tracked time so you can follow the fixed price's margin. It appears on no invoice." |
*
* @param {Missions_Reference_Rate_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_reference_rate_hint = /** @type {((inputs?: Missions_Reference_Rate_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Reference_Rate_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_reference_rate_hint(inputs)
	return en_missions_reference_rate_hint(inputs)
});