/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Claude_Key_RejectedInputs */

const en_expenses_scan_claude_key_rejected = /** @type {(inputs: Expenses_Scan_Claude_Key_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anthropic refused your key, so the receipt was read without Claude. Replace the key in Settings › Integrations.`)
};

const fr_expenses_scan_claude_key_rejected = /** @type {(inputs: Expenses_Scan_Claude_Key_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anthropic a refusé votre clé : le reçu a été lu sans Claude. Remplacez-la dans Réglages › Intégrations.`)
};

/**
* | output |
* | --- |
* | "Anthropic refused your key, so the receipt was read without Claude. Replace the key in Settings › Integrations." |
*
* @param {Expenses_Scan_Claude_Key_RejectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_claude_key_rejected = /** @type {((inputs?: Expenses_Scan_Claude_Key_RejectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Claude_Key_RejectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_claude_key_rejected(inputs)
	return en_expenses_scan_claude_key_rejected(inputs)
});