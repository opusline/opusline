/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Help_ShortcutsInputs */

const en_account_help_shortcuts = /** @type {(inputs: Account_Help_ShortcutsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Help and shortcuts`)
};

const fr_account_help_shortcuts = /** @type {(inputs: Account_Help_ShortcutsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aide et raccourcis`)
};

/**
* | output |
* | --- |
* | "Help and shortcuts" |
*
* @param {Account_Help_ShortcutsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const account_help_shortcuts = /** @type {((inputs?: Account_Help_ShortcutsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Help_ShortcutsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_help_shortcuts(inputs)
	return en_account_help_shortcuts(inputs)
});