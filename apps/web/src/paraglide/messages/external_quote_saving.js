/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_SavingInputs */

const en_external_quote_saving = /** @type {(inputs: External_Quote_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adding…`)
};

const fr_external_quote_saving = /** @type {(inputs: External_Quote_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajout…`)
};

/**
* | output |
* | --- |
* | "Adding…" |
*
* @param {External_Quote_SavingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_saving = /** @type {((inputs?: External_Quote_SavingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_SavingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_saving(inputs)
	return en_external_quote_saving(inputs)
});