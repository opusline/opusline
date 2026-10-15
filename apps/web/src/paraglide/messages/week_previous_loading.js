/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Previous_LoadingInputs */

const en_week_previous_loading = /** @type {(inputs: Week_Previous_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last week is still loading. Try again in a moment.`)
};

const fr_week_previous_loading = /** @type {(inputs: Week_Previous_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La semaine précédente est encore en cours de chargement. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "Last week is still loading. Try again in a moment." |
*
* @param {Week_Previous_LoadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_previous_loading = /** @type {((inputs?: Week_Previous_LoadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Previous_LoadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_previous_loading(inputs)
	return en_week_previous_loading(inputs)
});