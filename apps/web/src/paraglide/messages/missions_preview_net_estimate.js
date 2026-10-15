/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Preview_Net_EstimateInputs */

const en_missions_preview_net_estimate = /** @type {(inputs: Missions_Preview_Net_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimated net`)
};

const fr_missions_preview_net_estimate = /** @type {(inputs: Missions_Preview_Net_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Net estimé`)
};

/**
* | output |
* | --- |
* | "Estimated net" |
*
* @param {Missions_Preview_Net_EstimateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_preview_net_estimate = /** @type {((inputs?: Missions_Preview_Net_EstimateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Preview_Net_EstimateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_preview_net_estimate(inputs)
	return en_missions_preview_net_estimate(inputs)
});