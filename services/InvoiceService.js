import BaseService from "./BaseService";
import {environment} from "./environment";
import {GET, POST} from "./RequestMethods";

class InvoiceService extends BaseService {
    doInvoiceExport = (search_term) => (
        this.submitRequestWithPromise(POST, environment.apiEndPoint, `export/invoices`, {search_term})
    );

    getInvoices = (params) => (
        this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/invoices`, params)
    );

    /* Used for the generate invoice page. This works with a special token. */
    getInvoiceUnAuthed = ({invoice_id}) => (
        this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/invoices/invoice/${invoice_id}`)
    );

    getInvoice = ({invoice_id}) => (
        this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/invoices/${invoice_id}`)
    );

    processInvoice = ({invoice_id}) => (
        this.submitRequestWithPromise(POST, environment.apiEndPoint, `users/account/invoices/${invoice_id}/process`)
    );
}

export default new InvoiceService();
