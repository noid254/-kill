import React, { useState, useRef, useMemo, useEffect } from 'react';
import type { BusinessAssets, Document } from '../types';

declare const html2pdf: any;

interface LineItem {
  id: number;
  description: string;
  details: string;
  quantity: number;
  price: number;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const formatCurrency = (amount: number) => `Ksh ${currencyFormatter.format(amount)}`;

interface InvoiceGeneratorProps {
    assets: BusinessAssets;
    onSave: (doc: Omit<Document, 'id'>) => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ assets, onSave }) => {
  const [step, setStep] = useState(1);
  const [isSharing, setIsSharing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Invoice Data State
  const [fromName, setFromName] = useState(assets.name);
  const [toName, setToName] = useState('');
  const [toPhone, setToPhone] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-4)}`);
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  
  useEffect(() => {
    setFromName(assets.name);
  }, [assets]);

  const invoicePreviewRef = useRef<HTMLDivElement>(null);
  
  const total = useMemo(() => lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0), [lineItems]);

  const handleSaveAndShare = () => {
      const newDoc: Omit<Document, 'id'> = {
        type: 'Invoice',
        number: invoiceNumber,
        issuerName: fromName,
        clientName: toName,
        date: new Date(date).toISOString(),
        amount: total,
        currency: 'Ksh',
        paymentStatus: 'Pending',
        items: lineItems.map(i => ({ description: i.description, quantity: i.quantity, price: i.price, serial: i.details })),
      };
      onSave(newDoc);
      setIsShareModalOpen(true);
  };

  const generatePdf = () => {
    const element = invoicePreviewRef.current;
    if (!element) return;
    html2pdf().from(element).set({
        margin: 0,
        filename: `invoice-${invoiceNumber}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save();
  }
  
  const StepIndicator: React.FC<{currentStep: number}> = ({currentStep}) => (
    <div className="flex justify-center items-center mb-4">
      {[1,2,3].map(s => (
        <React.Fragment key={s}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep >= s ? 'bg-brand-dark text-white' : 'bg-gray-200 text-gray-500'}`}>
            {s}
          </div>
          {s < 3 && <div className={`h-1 w-8 ${currentStep > s ? 'bg-brand-dark' : 'bg-gray-200'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
       <div className="p-4 bg-white sticky top-0 z-10 shadow-sm border-b">
          <StepIndicator currentStep={step} />
      </div>
      
       <div className="p-4">
        {step === 1 && (
            <AddressStep 
                fromName={fromName} setFromName={setFromName}
                toName={toName} setToName={setToName}
                toPhone={toPhone} setToPhone={setToPhone}
                invoiceNumber={invoiceNumber} setInvoiceNumber={setInvoiceNumber}
                date={date} setDate={setDate}
                onNext={() => setStep(2)}
            />
        )}
        {step === 2 && (
            <ItemsStep
                lineItems={lineItems}
                setLineItems={setLineItems}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
            />
        )}
        {step === 3 && (
            <PreviewStep
                ref={invoicePreviewRef}
                fromName={fromName} toName={toName} invoiceNumber={invoiceNumber} date={date} lineItems={lineItems} total={total} logo={assets.logo}
                onBack={() => setStep(2)}
                onDownload={generatePdf}
                onShare={handleSaveAndShare}
            />
        )}
       </div>
       {isShareModalOpen && <ShareInvoiceModal clientPhone={toPhone} onClose={() => setIsShareModalOpen(false)} invoiceNumber={invoiceNumber} fromName={fromName} />}
    </div>
  );
};

const AddressStep: React.FC<any> = ({ fromName, setFromName, toName, setToName, toPhone, setToPhone, invoiceNumber, setInvoiceNumber, date, setDate, onNext }) => {
    const toNameRef = useRef<HTMLInputElement>(null);
    const toPhoneRef = useRef<HTMLInputElement>(null);
    const invoiceNumRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };
    
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Parties & Details</h2>
            <div className="space-y-4">
                 <div>
                    <label className="text-sm font-medium text-gray-700">From</label>
                    <input value={fromName} onChange={e => setFromName(e.target.value)} onKeyDown={e => handleKeyDown(e, toNameRef)} type="text" placeholder="Your Business Name" className="mt-1 w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">To (Client)</label>
                    <input ref={toNameRef} value={toName} onChange={e => setToName(e.target.value)} onKeyDown={e => handleKeyDown(e, toPhoneRef)} type="text" placeholder="Client Name" className="mt-1 w-full p-2 border rounded-md" />
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-700">Client's Phone (for SMS)</label>
                    <input ref={toPhoneRef} value={toPhone} onChange={e => setToPhone(e.target.value)} onKeyDown={e => handleKeyDown(e, invoiceNumRef)} type="tel" placeholder="07..." className="mt-1 w-full p-2 border rounded-md" />
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-700">Invoice #</label>
                    <input ref={invoiceNumRef} value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} onKeyDown={e => handleKeyDown(e, dateRef)} type="text" placeholder="Invoice #" className="mt-1 w-full p-2 border rounded-md" />
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <input ref={dateRef} value={date} onChange={e => setDate(e.target.value)} type="date" className="mt-1 w-full p-2 border rounded-md" />
                </div>
                <button onClick={onNext} className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg mt-4">Next</button>
            </div>
        </div>
    );
}

const ItemsStep: React.FC<{lineItems: LineItem[], setLineItems: (items: LineItem[]) => void, onBack: () => void, onNext: () => void}> = ({ lineItems, setLineItems, onBack, onNext }) => {
    const [desc, setDesc] = useState('');
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(0);

    const addItem = () => {
        if (!desc || !qty || !price) return;
        setLineItems([...lineItems, { id: Date.now(), description: desc, details: '', quantity: qty, price: price }]);
        setDesc(''); setQty(1); setPrice(0);
    };

    const removeItem = (id: number) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Invoice Items</h2>
            <div className="space-y-4">
                 <input value={desc} onChange={e => setDesc(e.target.value)} type="text" placeholder="Item/Service Description" className="w-full p-2 border rounded-md" />
                 <div className="grid grid-cols-2 gap-4">
                    <input value={qty} onChange={e => setQty(Number(e.target.value))} type="number" placeholder="Quantity" className="w-full p-2 border rounded-md" />
                    <input value={price} onChange={e => setPrice(Number(e.target.value))} type="number" placeholder="Price per item" className="w-full p-2 border rounded-md" />
                 </div>
                 <button onClick={addItem} className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg text-sm">+ Add Item</button>

                 <div className="space-y-2 pt-4">
                    {lineItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                                <p className="font-semibold">{item.description}</p>
                                <p className="text-sm text-gray-600">{item.quantity} x {formatCurrency(item.price)}</p>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-red-500 font-bold text-xl">&times;</button>
                        </div>
                    ))}
                 </div>

                 <div className="flex gap-2 pt-4">
                    <button onClick={onBack} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg">Back</button>
                    <button onClick={onNext} className="flex-1 bg-brand-dark text-white font-bold py-3 rounded-lg">Preview Invoice</button>
                 </div>
            </div>
        </div>
    )
}

const PreviewStep = React.forwardRef<HTMLDivElement, any>(({fromName, toName, invoiceNumber, date, lineItems, total, logo, onBack, onDownload, onShare}, ref) => {
    return (
        <div>
            <div ref={ref} className="bg-white p-8 rounded shadow-lg max-w-sm mx-auto border border-gray-200">
                <header className="flex justify-between items-start border-b pb-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
                        <p className="text-gray-500 text-sm">#{invoiceNumber}</p>
                    </div>
                    {logo && <img src={logo} alt="logo" className="max-h-12 max-w-[80px] object-contain"/>}
                </header>
                <section className="grid grid-cols-2 gap-4 mb-6 text-xs">
                    <div>
                        <h3 className="font-bold text-gray-500 uppercase mb-1">FROM</h3>
                        <p className="font-semibold text-gray-800">{fromName}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 uppercase mb-1">BILL TO</h3>
                        <p className="font-semibold text-gray-800">{toName}</p>
                    </div>
                </section>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-500 font-semibold uppercase">
                            <th className="py-2 pr-2">Item</th>
                            <th className="py-2 text-center">Qty</th>
                            <th className="py-2 text-right pl-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineItems.map((item: LineItem) => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2 pr-2 font-semibold text-gray-800">{item.description}</td>
                                <td className="py-2 text-center">{item.quantity}</td>
                                <td className="py-2 text-right pl-2">{formatCurrency(item.quantity * item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end mt-6">
                    <div className="w-full max-w-[200px] space-y-2">
                         <div className="flex justify-between items-center text-lg font-bold border-t-2 border-gray-800 pt-2 mt-2">
                            <span>TOTAL:</span>
                            <span>{formatCurrency(total)}</span>
                         </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 pt-4">
                <button onClick={onBack} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg">Back</button>
                <button onClick={onDownload} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg">Download PDF</button>
            </div>
            <button onClick={onShare} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg mt-2">Share Invoice</button>
        </div>
    )
});

const ShareInvoiceModal: React.FC<{clientPhone: string, onClose: () => void, invoiceNumber: string, fromName: string}> = ({ clientPhone, onClose, invoiceNumber, fromName }) => {
    const [phone, setPhone] = useState(clientPhone);
    
    const handleSend = () => {
        const invoiceLink = `https://nikosoko.app/invoice/${invoiceNumber}`;
        const message = `Hello, here is your invoice ${invoiceNumber} from ${fromName}. You can view it here: ${invoiceLink}`;
        window.open(`sms:${phone}?body=${encodeURIComponent(message)}`);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Share via SMS</h2>
                <p className="text-sm text-gray-600 mb-2">Enter your client's phone number to send them a link to the invoice.</p>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded-md mb-4" placeholder="Client's phone number" />
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded-lg">Cancel</button>
                    <button onClick={handleSend} className="flex-1 bg-green-500 text-white font-bold py-2 rounded-lg">Send SMS</button>
                </div>
            </div>
        </div>
    );
};


export default InvoiceGenerator;