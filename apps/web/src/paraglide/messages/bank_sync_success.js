/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Bank_Sync_SuccessInputs */

const en_bank_sync_success = /** @type {(inputs: Bank_Sync_SuccessInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} new movement`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} new movements`);
	return /** @type {LocalizedString} */ ("bank_sync_success");
};

const fr_bank_sync_success = /** @type {(inputs: Bank_Sync_SuccessInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} nouveau mouvement`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} nouveaux mouvements`);
	return /** @type {LocalizedString} */ ("bank_sync_success");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} new movement" |
* | "other" | "{count} new movements" |
*
* @param {Bank_Sync_SuccessInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_sync_success = /** @type {((inputs: Bank_Sync_SuccessInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Sync_SuccessInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_sync_success(inputs)
	return en_bank_sync_success(inputs)
});