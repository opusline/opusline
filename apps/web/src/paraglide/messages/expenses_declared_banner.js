/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown>, date: NonNullable<unknown>, amount: NonNullable<unknown> }} Expenses_Declared_BannerInputs */

const en_expenses_declared_banner = /** @type {(inputs: Expenses_Declared_BannerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CA3 ${i?.month} filed on ${i?.date} · ${i?.amount} deducted`)
};

const fr_expenses_declared_banner = /** @type {(inputs: Expenses_Declared_BannerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CA3 ${i?.month} déclarée le ${i?.date} · ${i?.amount} déduits`)
};

/**
* | output |
* | --- |
* | "CA3 {month} filed on {date} · {amount} deducted" |
*
* @param {Expenses_Declared_BannerInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_declared_banner = /** @type {((inputs: Expenses_Declared_BannerInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Declared_BannerInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_declared_banner(inputs)
	return en_expenses_declared_banner(inputs)
});