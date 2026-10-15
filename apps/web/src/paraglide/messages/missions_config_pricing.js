/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Config_PricingInputs */

const en_missions_config_pricing = /** @type {(inputs: Missions_Config_PricingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pricing`)
};

const fr_missions_config_pricing = /** @type {(inputs: Missions_Config_PricingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tarification`)
};

/**
* | output |
* | --- |
* | "Pricing" |
*
* @param {Missions_Config_PricingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_config_pricing = /** @type {((inputs?: Missions_Config_PricingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Config_PricingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_config_pricing(inputs)
	return en_missions_config_pricing(inputs)
});