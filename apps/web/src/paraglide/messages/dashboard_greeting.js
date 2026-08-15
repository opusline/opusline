/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Dashboard_GreetingInputs */

const en_dashboard_greeting = /** @type {(inputs: Dashboard_GreetingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Hello, ${i?.name}`)
};

const fr_dashboard_greeting = /** @type {(inputs: Dashboard_GreetingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Bonjour, ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Hello, {name}" |
*
* @param {Dashboard_GreetingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const dashboard_greeting = /** @type {((inputs: Dashboard_GreetingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_GreetingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_dashboard_greeting(inputs)
	return en_dashboard_greeting(inputs)
});