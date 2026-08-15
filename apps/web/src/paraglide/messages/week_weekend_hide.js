/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Weekend_HideInputs */

const en_week_weekend_hide = /** @type {(inputs: Week_Weekend_HideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hide the weekend`)
};

const fr_week_weekend_hide = /** @type {(inputs: Week_Weekend_HideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Masquer le week-end`)
};

/**
* | output |
* | --- |
* | "Hide the weekend" |
*
* @param {Week_Weekend_HideInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_weekend_hide = /** @type {((inputs?: Week_Weekend_HideInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Weekend_HideInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_weekend_hide(inputs)
	return en_week_weekend_hide(inputs)
});