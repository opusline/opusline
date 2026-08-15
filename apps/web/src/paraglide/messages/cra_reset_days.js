/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Reset_DaysInputs */

const en_cra_reset_days = /** @type {(inputs: Cra_Reset_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restore my entries`)
};

const fr_cra_reset_days = /** @type {(inputs: Cra_Reset_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rétablir mes entrées`)
};

/**
* | output |
* | --- |
* | "Restore my entries" |
*
* @param {Cra_Reset_DaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_reset_days = /** @type {((inputs?: Cra_Reset_DaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Reset_DaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_reset_days(inputs)
	return en_cra_reset_days(inputs)
});