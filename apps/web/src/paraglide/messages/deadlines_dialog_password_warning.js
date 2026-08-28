/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Dialog_Password_WarningInputs */

const en_deadlines_dialog_password_warning = /** @type {(inputs: Deadlines_Dialog_Password_WarningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Treat it like a password: whoever holds it can read your deadlines. Regenerate it if it has been passed around.`)
};

const fr_deadlines_dialog_password_warning = /** @type {(inputs: Deadlines_Dialog_Password_WarningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traitez-la comme un mot de passe : qui la détient peut lire vos échéances. Régénérez-la si elle a circulé.`)
};

/**
* | output |
* | --- |
* | "Treat it like a password: whoever holds it can read your deadlines. Regenerate it if it has been passed around." |
*
* @param {Deadlines_Dialog_Password_WarningInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_dialog_password_warning = /** @type {((inputs?: Deadlines_Dialog_Password_WarningInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Dialog_Password_WarningInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_dialog_password_warning(inputs)
	return en_deadlines_dialog_password_warning(inputs)
});