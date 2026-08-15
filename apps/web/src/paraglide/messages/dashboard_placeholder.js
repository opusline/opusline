/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dashboard_PlaceholderInputs */

const en_dashboard_placeholder = /** @type {(inputs: Dashboard_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The dashboard lands here — the week's activity and upcoming deadlines.`)
};

const fr_dashboard_placeholder = /** @type {(inputs: Dashboard_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le tableau de bord arrive ici — activité de la semaine et prochaines échéances.`)
};

/**
* | output |
* | --- |
* | "The dashboard lands here — the week's activity and upcoming deadlines." |
*
* @param {Dashboard_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const dashboard_placeholder = /** @type {((inputs?: Dashboard_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_dashboard_placeholder(inputs)
	return en_dashboard_placeholder(inputs)
});