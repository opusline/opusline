/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_ReintegratedInputs */

const en_expenses_reintegrated = /** @type {(inputs: Expenses_ReintegratedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back on the CA3`)
};

const fr_expenses_reintegrated = /** @type {(inputs: Expenses_ReintegratedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réintégrée dans la CA3`)
};

/**
* | output |
* | --- |
* | "Back on the CA3" |
*
* @param {Expenses_ReintegratedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_reintegrated = /** @type {((inputs?: Expenses_ReintegratedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_ReintegratedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_reintegrated(inputs)
	return en_expenses_reintegrated(inputs)
});