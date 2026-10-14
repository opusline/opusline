/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Invoicing_Legal_Title_SecondInputs */

const en_invoicing_legal_title_second = /** @type {(inputs: Invoicing_Legal_Title_SecondInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Legal reference · second half of ${i?.year}`)
};

const fr_invoicing_legal_title_second = /** @type {(inputs: Invoicing_Legal_Title_SecondInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Référentiel légal · 2e semestre ${i?.year}`)
};

/**
* | output |
* | --- |
* | "Legal reference · second half of {year}" |
*
* @param {Invoicing_Legal_Title_SecondInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_title_second = /** @type {((inputs: Invoicing_Legal_Title_SecondInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_Title_SecondInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_title_second(inputs)
	return en_invoicing_legal_title_second(inputs)
});