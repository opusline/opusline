/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Documents_Send_CountInputs */

const en_documents_send_count = /** @type {(inputs: Documents_Send_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Send ${i?.count} document`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Send ${i?.count} documents`);
	return /** @type {LocalizedString} */ ("documents_send_count");
};

const fr_documents_send_count = /** @type {(inputs: Documents_Send_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Envoyer ${i?.count} document`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Envoyer ${i?.count} documents`);
	return /** @type {LocalizedString} */ ("documents_send_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Send {count} document" |
* | "other" | "Send {count} documents" |
*
* @param {Documents_Send_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_send_count = /** @type {((inputs: Documents_Send_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Send_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_send_count(inputs)
	return en_documents_send_count(inputs)
});