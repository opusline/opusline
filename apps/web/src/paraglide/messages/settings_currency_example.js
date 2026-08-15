/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Currency_ExampleInputs */

const en_settings_currency_example = /** @type {(inputs: Settings_Currency_ExampleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Example:`)
};

const fr_settings_currency_example = /** @type {(inputs: Settings_Currency_ExampleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exemple :`)
};

/**
* | output |
* | --- |
* | "Example:" |
*
* @param {Settings_Currency_ExampleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_currency_example = /** @type {((inputs?: Settings_Currency_ExampleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Currency_ExampleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_currency_example(inputs)
	return en_settings_currency_example(inputs)
});