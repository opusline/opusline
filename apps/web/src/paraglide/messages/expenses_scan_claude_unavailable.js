/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Claude_UnavailableInputs */

const en_expenses_scan_claude_unavailable = /** @type {(inputs: Expenses_Scan_Claude_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claude was unavailable, so the receipt was read without it. Try again in a few minutes.`)
};

const fr_expenses_scan_claude_unavailable = /** @type {(inputs: Expenses_Scan_Claude_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claude était indisponible : le reçu a été lu sans lui. Réessayez dans quelques minutes.`)
};

/**
* | output |
* | --- |
* | "Claude was unavailable, so the receipt was read without it. Try again in a few minutes." |
*
* @param {Expenses_Scan_Claude_UnavailableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_claude_unavailable = /** @type {((inputs?: Expenses_Scan_Claude_UnavailableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Claude_UnavailableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_claude_unavailable(inputs)
	return en_expenses_scan_claude_unavailable(inputs)
});