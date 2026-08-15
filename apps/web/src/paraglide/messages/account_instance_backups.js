/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Instance_BackupsInputs */

const en_account_instance_backups = /** @type {(inputs: Account_Instance_BackupsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Instance and backups`)
};

const fr_account_instance_backups = /** @type {(inputs: Account_Instance_BackupsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Instance et sauvegardes`)
};

/**
* | output |
* | --- |
* | "Instance and backups" |
*
* @param {Account_Instance_BackupsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const account_instance_backups = /** @type {((inputs?: Account_Instance_BackupsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Instance_BackupsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_instance_backups(inputs)
	return en_account_instance_backups(inputs)
});