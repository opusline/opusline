/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Anthropic_ConsoleInputs */

const en_integrations_anthropic_console = /** @type {(inputs: Integrations_Anthropic_ConsoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open the Anthropic console`)
};

const fr_integrations_anthropic_console = /** @type {(inputs: Integrations_Anthropic_ConsoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir la console Anthropic`)
};

/**
* | output |
* | --- |
* | "Open the Anthropic console" |
*
* @param {Integrations_Anthropic_ConsoleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_anthropic_console = /** @type {((inputs?: Integrations_Anthropic_ConsoleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Anthropic_ConsoleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_anthropic_console(inputs)
	return en_integrations_anthropic_console(inputs)
});