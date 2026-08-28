/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Bank_Reconciliation_StatusInputs */

const en_bank_reconciliation_status = /** @type {(inputs: Bank_Reconciliation_StatusInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} reconciliation left to validate`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} reconciliations left to validate`);
	return /** @type {LocalizedString} */ ("bank_reconciliation_status");
};

const fr_bank_reconciliation_status = /** @type {(inputs: Bank_Reconciliation_StatusInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} rapprochement restant à valider`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} rapprochements restants à valider`);
	return /** @type {LocalizedString} */ ("bank_reconciliation_status");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} reconciliation left to validate" |
* | "other" | "{count} reconciliations left to validate" |
*
* @param {Bank_Reconciliation_StatusInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_reconciliation_status = /** @type {((inputs: Bank_Reconciliation_StatusInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Reconciliation_StatusInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_reconciliation_status(inputs)
	return en_bank_reconciliation_status(inputs)
});