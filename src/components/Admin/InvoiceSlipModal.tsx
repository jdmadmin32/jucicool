import React, { useRef } from 'react';
import { X, Printer } from 'lucide-react';

interface InvoiceItem {
  product_name: string;
  pack_size: string;
  requested_quantity: number;
  approved_unit_price: number;
  total_price: number;
  hsn_sac?: string;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  poNumber?: string;
  vehicleNo?: string;
  placeOfSupply?: string;

  // Seller (JDM)
  sellerName: string;
  sellerAddress: string;
  sellerGstin: string;
  sellerState: string;

  // Buyer
  buyerName: string;
  buyerAddress: string;
  buyerContact: string;
  buyerPhone: string;
  buyerGstin?: string;
  buyerState: string;

  // Items
  items: InvoiceItem[];

  // Totals
  subtotal: number;
  cgstAmount: number;
  cgstRate: number;
  sgstAmount: number;
  sgstRate: number;
  igstAmount: number;
  igstRate: number;
  totalTax: number;
  grandTotal: number;
  roundingOff?: number;

  // Bank
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
}

interface InvoiceSlipModalProps {
  invoiceData: InvoiceData;
  onClose: () => void;
}

function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  }

  const integer = Math.floor(num);
  const decimal = Math.round((num - integer) * 100);
  let words = 'Rupees : ' + convert(integer);
  if (decimal > 0) words += ' and ' + convert(decimal) + ' Paise';
  words += ' Only.';
  return words;
}

export const InvoiceSlipModal: React.FC<InvoiceSlipModalProps> = ({ invoiceData, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Proforma Invoice - ${invoiceData.invoiceNumber}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; color: #000; background: #fff; }
          table { border-collapse: collapse; width: 100%; }
          td, th { border: 1px solid #000; padding: 3px 6px; }
          .no-border td, .no-border th { border: none; }
          @page { margin: 10mm; size: A4; }
        </style>
      </head>
      <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const totalCases = invoiceData.items.reduce((sum, it) => sum + it.requested_quantity, 0);
  const taxableValue = invoiceData.subtotal - (invoiceData.cgstAmount + invoiceData.sgstAmount + invoiceData.igstAmount);
  const amountInWords = numberToWords(invoiceData.grandTotal);

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/70 backdrop-blur-sm flex items-start justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl my-4">
        {/* Toolbar — hidden in print */}
        <div className="no-print flex items-center justify-between px-6 py-3 bg-[#183D2B] text-white">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">Proforma Invoice — {invoiceData.invoiceNumber}</span>
            <span className="text-xs text-white/70">JDM Fruit Products Pvt. Ltd.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FFC928] text-[#183D2B] font-bold text-xs hover:bg-yellow-400 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#000', padding: '12px', background: '#fff' }}>
          {/* Company Header */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '8px', width: '80px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <img src="/images/juci-cool-logo.png" alt="Juci Cool" style={{ height: '50px', width: 'auto' }} />
                </td>
                <td style={{ border: '1px solid #000', padding: '6px 12px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '1px' }}>JDM FRUIT PRODUCTS PRIVATE LIMITED</div>
                  <div style={{ fontSize: '10px', marginTop: '3px' }}>
                    Address: Sy.no.230/a, SVI Eco park, Ravalkole Village, Medchal Mandal, Medchal-Malkajgiri District-501401, Telangana
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* FSSAI / GST / PAN / CIN Row */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '4px 6px', width: '30%', fontSize: '10px' }}>
                  <strong>FSSAI License number is 10014047000280</strong>
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 6px', width: '20%', fontSize: '10px' }}>
                  <div style={{ fontSize: '9px' }}>GST No.</div>
                  <strong>36AACCJ4921G1ZQ</strong>
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 6px', width: '25%', fontSize: '10px' }}>
                  <strong>PAN No.AACCJ4921G</strong>
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 6px', width: '25%', fontSize: '10px' }}>
                  <strong>CIN No.U15313AP2010PTC071798</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Proforma Invoice Title */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }} colSpan={3}>
                  Proforma Invoice
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: '4px 8px', width: '33%', textAlign: 'center', fontSize: '10px' }}>
                  Original for Recipient
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 8px', width: '34%', textAlign: 'center', fontSize: '10px' }}>
                  Duplicate for Transporter
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 8px', width: '33%', textAlign: 'center', fontSize: '10px' }}>
                  Triplicate for Supplier
                </td>
              </tr>
            </tbody>
          </table>

          {/* Billed To / Ship To / Invoice Details */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {/* Billed To */}
                <td style={{ border: '1px solid #000', padding: '6px 8px', width: '40%', verticalAlign: 'top', fontSize: '10px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>Details of Receiver (Billed to)</div>
                  <div style={{ fontWeight: 'bold', fontSize: '11px' }}>Name: {invoiceData.buyerName.toUpperCase()}</div>
                  <div>{invoiceData.buyerAddress}</div>
                  <div>contact Person : {invoiceData.buyerContact}</div>
                  <div>Contact No : {invoiceData.buyerPhone}</div>
                  <div style={{ marginTop: '4px' }}>
                    <div>State: {invoiceData.buyerState.toUpperCase()}</div>
                    {invoiceData.buyerGstin && <div>GST No: {invoiceData.buyerGstin}</div>}
                  </div>
                </td>

                {/* Ship To */}
                <td style={{ border: '1px solid #000', padding: '6px 8px', width: '40%', verticalAlign: 'top', fontSize: '10px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>Details of Receiver (Ship to)</div>
                  <div style={{ fontWeight: 'bold', fontSize: '11px' }}>Name: {invoiceData.buyerName.toUpperCase()}</div>
                  <div>{invoiceData.buyerAddress}</div>
                  <div>contact Person : {invoiceData.buyerContact}</div>
                  <div>Contact No : {invoiceData.buyerPhone}</div>
                  <div style={{ marginTop: '4px' }}>
                    <div>State: {invoiceData.buyerState.toUpperCase()}</div>
                    {invoiceData.buyerGstin && <div>GST No: {invoiceData.buyerGstin}</div>}
                  </div>
                </td>

                {/* Invoice Meta */}
                <td style={{ border: '1px solid #000', padding: '0', width: '20%', verticalAlign: 'top', fontSize: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', height: '100%' }}>
                    <tbody>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 5px' }}>Invoice No.</td>
                        <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>{invoiceData.invoiceNumber}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 5px' }}>Date</td>
                        <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>{invoiceData.date}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 5px' }}>P.O.No.</td>
                        <td style={{ border: '1px solid #000', padding: '3px 5px' }}>{invoiceData.poNumber || ''}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 5px' }}>Vehicle No.</td>
                        <td style={{ border: '1px solid #000', padding: '3px 5px' }}>{invoiceData.vehicleNo || ''}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 5px' }}>Place of Supply</td>
                        <td style={{ border: '1px solid #000', padding: '3px 5px' }}></td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }} colSpan={2}>
                          {invoiceData.placeOfSupply || invoiceData.buyerState.toUpperCase()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '4%' }}>Item no.</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '22%' }}>Description of</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '10%' }}>HSN/<br/>SAC</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '7%' }}>Cases</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '8%' }}>Case Price</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '10%' }}>Taxable<br/>Value</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '6%' }}>CGST<br/>Rate</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '7%' }}>CGST<br/>Amount</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '6%' }}>SGST<br/>Rate</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '7%' }}>SGST<br/>Amount</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '6%' }}>IGST<br/>Rate</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '7%' }}>IGST<br/>Amount</th>
                <th style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center', width: '10%' }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, idx) => {
                const taxableItemVal = item.total_price;
                const igstAmt = invoiceData.igstRate > 0 ? (taxableItemVal * invoiceData.igstRate / 100) : 0;
                const cgstAmt = invoiceData.cgstRate > 0 ? (taxableItemVal * invoiceData.cgstRate / 100) : 0;
                const sgstAmt = invoiceData.sgstRate > 0 ? (taxableItemVal * invoiceData.sgstRate / 100) : 0;
                const itemTotal = taxableItemVal + igstAmt + cgstAmt + sgstAmt;
                return (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px' }}>{item.product_name}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{item.hsn_sac || '22029020'}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{item.requested_quantity}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right' }}>{item.approved_unit_price.toFixed(2)}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right' }}>{taxableItemVal.toFixed(2)}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{invoiceData.cgstRate > 0 ? `${invoiceData.cgstRate}%` : '0%'}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right' }}>{cgstAmt > 0 ? cgstAmt.toFixed(2) : '-'}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{invoiceData.sgstRate > 0 ? `${invoiceData.sgstRate}%` : '0%'}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right' }}>{sgstAmt > 0 ? sgstAmt.toFixed(2) : '-'}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{invoiceData.igstRate > 0 ? `${invoiceData.igstRate}%` : '5%'}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right' }}>{igstAmt > 0 ? igstAmt.toFixed(2) : (taxableItemVal * 0.05).toFixed(2)}</td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right', fontWeight: 'bold' }}>
                      {(igstAmt > 0 ? itemTotal : taxableItemVal + taxableItemVal * 0.05).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              {/* Empty rows to fill page */}
              {Array.from({ length: Math.max(0, 8 - invoiceData.items.length) }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  {Array.from({ length: 13 }).map((_, j) => (
                    <td key={j} style={{ border: '1px solid #000', padding: '8px 5px' }}>&nbsp;</td>
                  ))}
                </tr>
              ))}
              {/* Total Row */}
              <tr style={{ fontWeight: 'bold', background: '#f9f9f9' }}>
                <td style={{ border: '1px solid #000', padding: '4px 5px' }} colSpan={3}>Total</td>
                <td style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'center' }}>{totalCases}</td>
                <td style={{ border: '1px solid #000', padding: '4px 5px' }}></td>
                <td style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'right' }}>{invoiceData.subtotal.toFixed(2)}</td>
                <td style={{ border: '1px solid #000', padding: '4px 5px' }}></td>
                <td style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'right' }}>{invoiceData.cgstAmount > 0 ? invoiceData.cgstAmount.toFixed(2) : '-'}</td>
                <td style={{ border: '1px solid #000', padding: '4px 5px' }}></td>
                <td style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'right' }}>{invoiceData.sgstAmount > 0 ? invoiceData.sgstAmount.toFixed(2) : '-'}</td>
                <td style={{ border: '1px solid #000', padding: '4px 5px' }}></td>
                <td style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'right' }}>{invoiceData.igstAmount.toFixed(2)}</td>
                <td style={{ border: '1px solid #000', padding: '4px 5px', textAlign: 'right' }}>{invoiceData.grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Bottom Section: Words + Bank + Totals */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {/* Left: Amount in words + Bank Details */}
                <td style={{ border: '1px solid #000', padding: '6px 8px', width: '60%', verticalAlign: 'top', fontSize: '10px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Invoice Total (In Words):-</div>
                  <div>{amountInWords}</div>
                  <div style={{ marginTop: '10px', fontWeight: 'bold' }}>Our Bank Details :-</div>
                  <div>Name of the Bank: {invoiceData.bankName},</div>
                  <div>Account Number : {invoiceData.accountNumber}</div>
                  <div>IFSC Code: {invoiceData.ifscCode}</div>
                  <div>Name of the Branch: {invoiceData.branchName}</div>
                </td>

                {/* Right: Tax breakdown sidebar */}
                <td style={{ border: '1px solid #000', padding: '0', width: '40%', verticalAlign: 'top', fontSize: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px' }}>Taxable Amount</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', textAlign: 'right' }}>{invoiceData.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px' }}>CGST</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', textAlign: 'right' }}>{invoiceData.cgstAmount > 0 ? invoiceData.cgstAmount.toFixed(2) : '-'}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px' }}>SGST</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', textAlign: 'right' }}>{invoiceData.sgstAmount > 0 ? invoiceData.sgstAmount.toFixed(2) : '-'}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px' }}>IGST</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', textAlign: 'right' }}>{invoiceData.igstAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px' }}>Rounding</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', textAlign: 'right' }}>{invoiceData.roundingOff !== undefined ? invoiceData.roundingOff.toFixed(2) : '-'}</td>
                      </tr>
                      <tr style={{ fontWeight: 'bold', background: '#f5f5f5' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '11px' }}>Total Amount</td>
                        <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'right', fontSize: '11px' }}>{invoiceData.grandTotal.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Declaration + Signature */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '6px 8px', width: '60%', verticalAlign: 'top', fontSize: '10px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Declaration/ Terms of Supply:</div>
                  <div>1) Goods once sold will not be taken back.</div>
                  <div>2) If any damages in transit, should claim immediately on receipt of the same.</div>
                  <div>3) All transactions through bank only.</div>
                </td>
                <td style={{ border: '1px solid #000', padding: '6px 8px', width: '40%', verticalAlign: 'top', fontSize: '10px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '30px' }}>For JDM FRUIT PRODUCTS PRIVATE LIMITED</div>
                  <div style={{ marginTop: '30px', paddingTop: '8px', borderTop: '1px solid #000' }}>AUTHORISED SIGNATURE</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper to build InvoiceData from a quotation + enquiry objects
export function buildInvoiceFromQuotation(
  quotation: any,
  enquiry: any
): InvoiceData {
  const igstRate = 5; // Default 5% IGST for beverages (inter-state)
  const igstAmount = quotation.tax_amount || (quotation.subtotal * igstRate / 100);

  return {
    invoiceNumber: `PI${quotation.quotation_number?.replace('JC-QT-', '') || String(quotation.id)}`,
    date: new Date(quotation.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
    poNumber: '',
    vehicleNo: '',
    placeOfSupply: enquiry?.state?.toUpperCase() || 'TELANGANA',

    sellerName: 'JDM FRUIT PRODUCTS PRIVATE LIMITED',
    sellerAddress: 'Sy.no.230/a, SVI Eco park, Ravalkole Village, Medchal Mandal, Medchal-Malkajgiri District-501401, Telangana',
    sellerGstin: '36AACCJ4921G1ZQ',
    sellerState: 'TELANGANA',

    buyerName: quotation.business_name || enquiry?.business_name || 'Customer',
    buyerAddress: enquiry?.delivery_location || enquiry?.city || '',
    buyerContact: quotation.customer_name || enquiry?.customer_name || '',
    buyerPhone: quotation.phone_number || enquiry?.phone_number || '',
    buyerGstin: enquiry?.gstin || '',
    buyerState: enquiry?.state?.toUpperCase() || 'ANDHRA PRADESH',

    items: (quotation.items || []).map((it: any) => ({
      product_name: it.product_name,
      pack_size: it.pack_size,
      requested_quantity: it.requested_quantity,
      approved_unit_price: Number(it.approved_unit_price),
      total_price: Number(it.total_price),
      hsn_sac: '22029020',
    })),

    subtotal: Number(quotation.subtotal || 0),
    cgstAmount: 0,
    cgstRate: 0,
    sgstAmount: 0,
    sgstRate: 0,
    igstAmount: igstAmount,
    igstRate: igstRate,
    totalTax: igstAmount,
    grandTotal: Number(quotation.grand_total || 0),
    roundingOff: Number(((quotation.grand_total || 0) - Math.floor(quotation.grand_total || 0)).toFixed(2)) * -1,

    bankName: 'Punjab National Bank',
    accountNumber: '0421008700000752',
    ifscCode: 'PUNB0042100',
    branchName: 'R.P. Road, Secunderabad',
  };
}

// Helper to build InvoiceData directly from an enquiry and its items (when no quotation was pre-generated)
export function buildInvoiceFromEnquiry(
  enquiry: any,
  rawItems?: any[]
): InvoiceData {
  const enquiryItems = (rawItems && rawItems.length > 0) ? rawItems : (enquiry.items || []);
  
  const items: InvoiceItem[] = (enquiryItems.length > 0 ? enquiryItems : [
    { product_name: 'Juci Cool Mango Drink (Pouch)', pack_size: '160 ml Spout Pouch', requested_quantity: 200 }
  ]).map((it: any) => {
    const qty = Number(it.requested_quantity || it.quantity || 100);
    const nameLower = (it.product_name || '').toLowerCase();
    let unitPrice = 161.90; // Default case price matching JDM Proforma Invoice slip (Mango 200ml = 161.90)
    if (nameLower.includes('lemon') || nameLower.includes('orange')) {
      unitPrice = 126.67; // JGP Orange / Lemon 180ml = 126.67 from official slip
    } else if (nameLower.includes('water')) {
      unitPrice = 110.00;
    } else if (nameLower.includes('candy') || nameLower.includes('jelly')) {
      unitPrice = 135.00;
    } else if (it.approved_unit_price || it.unit_price) {
      unitPrice = Number(it.approved_unit_price || it.unit_price);
    }

    const lineTotal = Number((qty * unitPrice).toFixed(2));
    return {
      product_name: it.product_name || 'Juci Cool Product',
      pack_size: it.pack_size || 'Spout Pouch',
      requested_quantity: qty,
      approved_unit_price: unitPrice,
      total_price: lineTotal,
      hsn_sac: '22029020',
    };
  });

  const subtotal = Number(items.reduce((sum, it) => sum + it.total_price, 0).toFixed(2));
  const igstRate = 5;
  const igstAmount = Number((subtotal * igstRate / 100).toFixed(2));
  const rawGrandTotal = subtotal + igstAmount;
  const grandTotal = Math.round(rawGrandTotal);
  const roundingOff = Number((grandTotal - rawGrandTotal).toFixed(2));

  return {
    invoiceNumber: `PI${enquiry.enquiry_number ? enquiry.enquiry_number.replace('JC-BLK-', '') : (enquiry.id ? String(1190 + Number(enquiry.id)) : '1199')}`,
    date: new Date(enquiry.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
    poNumber: '',
    vehicleNo: '',
    placeOfSupply: (enquiry.state || 'ANDHRA PRADESH').toUpperCase(),

    sellerName: 'JDM FRUIT PRODUCTS PRIVATE LIMITED',
    sellerAddress: 'Sy.no.230/a, SVI Eco park, Ravalkole Village, Medchal Mandal, Medchal-Malkajgiri District-501401, Telangana',
    sellerGstin: '36AACCJ4921G1ZQ',
    sellerState: 'TELANGANA',

    buyerName: enquiry.business_name || enquiry.customer_name || 'SRI KAVYA ENTERPRISES',
    buyerAddress: enquiry.delivery_location || (enquiry.city ? `${enquiry.city}, ${enquiry.state || 'Telangana'}` : 'Visakhapatnam, Andhra Pradesh, 531149'),
    buyerContact: enquiry.customer_name || 'SURU INDU',
    buyerPhone: enquiry.phone_number || '9439478478',
    buyerGstin: enquiry.gstin || (enquiry.state === 'Andhra Pradesh' || !enquiry.state ? '37AFOPIS846P1ZJ' : ''),
    buyerState: (enquiry.state || 'ANDHRA PRADESH').toUpperCase(),

    items,
    subtotal,
    cgstAmount: 0,
    cgstRate: 0,
    sgstAmount: 0,
    sgstRate: 0,
    igstAmount,
    igstRate,
    totalTax: igstAmount,
    grandTotal,
    roundingOff,

    bankName: 'Punjab National Bank',
    accountNumber: '0421008700000752',
    ifscCode: 'PUNB0042100',
    branchName: 'R.P. Road, Secunderabad',
  };
}

// Master helper: returns invoice from quotations if available, otherwise from enquiry items
export function generateInvoiceSlip(
  enquiry: any,
  quotations?: any[],
  items?: any[]
): InvoiceData {
  if (quotations && quotations.length > 0) {
    return buildInvoiceFromQuotation(quotations[0], enquiry);
  }
  return buildInvoiceFromEnquiry(enquiry, items);
}
