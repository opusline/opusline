/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_SavingInputs */

const en_common_saving = /** @type {(inputs: Common_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saving…`)
};

const fr_common_saving = /** @type {(inputs: Common_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrement…`)
};

/**
* | output |
* | --- |
* | "Saving…" |
*
* @param {Common_SavingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_saving = /** @type {((inputs?: Common_SavingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_SavingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_saving(inputs)
	return en_common_saving(inputs)
});