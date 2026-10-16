/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Trade_Registry_HintInputs */

const en_settings_trade_registry_hint = /** @type {(inputs: Settings_Trade_Registry_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only if you are registered as a commerçant (RCS) or an artisan (RM).`)
};

const fr_settings_trade_registry_hint = /** @type {(inputs: Settings_Trade_Registry_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Seulement si vous êtes immatriculé comme commerçant (RCS) ou artisan (RM).`)
};

/**
* | output |
* | --- |
* | "Only if you are registered as a commerçant (RCS) or an artisan (RM)." |
*
* @param {Settings_Trade_Registry_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_trade_registry_hint = /** @type {((inputs?: Settings_Trade_Registry_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Trade_Registry_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_trade_registry_hint(inputs)
	return en_settings_trade_registry_hint(inputs)
});