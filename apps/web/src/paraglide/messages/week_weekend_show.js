/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Weekend_ShowInputs */

const en_week_weekend_show = /** @type {(inputs: Week_Weekend_ShowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show the weekend`)
};

const fr_week_weekend_show = /** @type {(inputs: Week_Weekend_ShowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Afficher le week-end`)
};

/**
* | output |
* | --- |
* | "Show the weekend" |
*
* @param {Week_Weekend_ShowInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_weekend_show = /** @type {((inputs?: Week_Weekend_ShowInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Weekend_ShowInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_weekend_show(inputs)
	return en_week_weekend_show(inputs)
});