/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Context_RouteInputs */

const en_report_context_route = /** @type {(inputs: Report_Context_RouteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Page`)
};

const fr_report_context_route = /** @type {(inputs: Report_Context_RouteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Page`)
};

/**
* | output |
* | --- |
* | "Page" |
*
* @param {Report_Context_RouteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_context_route = /** @type {((inputs?: Report_Context_RouteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Context_RouteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_context_route(inputs)
	return en_report_context_route(inputs)
});