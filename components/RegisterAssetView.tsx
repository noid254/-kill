import React, { useState, useRef } from 'react';
import type { Document } from '../types';

interface RegisterAssetViewProps {
    onBack: () => void;
    onSave: (doc: Omit<Document, 'id'>) => void;
}

const RegisterAssetView: React.FC<RegisterAssetViewProps> = ({ onBack, onSave }) => {
    const [assetType, setAssetType] = useState<Document['assetType']>('Vehicle');
    const [itemDesc, setItemDesc] = useState('');
    const [itemSerial, setItemSerial] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [model, setModel] = useState('');
    const [yom, setYom] = useState('');
    const [specifications, setSpecifications] = useState('');
    const [productImages, setProductImages] = useState<string[]>([]);
    const [logbookImage, setLogbookImage] = useState<string | null>(null);

    const productImgRef = useRef<HTMLInputElement>(null);
    const logbookImgRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'logbook') => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            if (type === 'product') {
                setProductImages(prev => [...prev, result].slice(0, 4)); // Limit to 4 images
            } else {
                setLogbookImage(result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let isDataMissing = false;
        if (assetType === 'Vehicle' && (!regNumber || !model || !yom)) isDataMissing = true;
        if (assetType === 'Tool' && (!itemDesc || !itemSerial)) isDataMissing = true;
        if (assetType === 'Electronics' && (!itemDesc || !itemSerial)) isDataMissing = true;
        if (isDataMissing) {
            alert('Please fill all required fields for the selected asset type.');
            return;
        }

        const newDoc: Omit<Document, 'id'> = {
            type: 'Receipt', // Stored as a receipt document internally
            number: assetType === 'Vehicle' ? regNumber : itemSerial,
            issuerName: 'Self-Registered',
            date: new Date().toISOString(),
            amount: 0,
            currency: 'Ksh',
            paymentStatus: 'Paid',
            isAsset: true,
            verificationStatus: 'Pending',
            assetType,
            registrationNumber: regNumber || undefined,
            model: model || undefined,
            yearOfManufacture: yom || undefined,
            items: itemDesc ? [{ description: itemDesc, quantity: 1, price: 0, serial: itemSerial || undefined }] : [],
            specifications: specifications || undefined,
            productImages: productImages,
            logbookImageUrl: logbookImage || undefined,
        };

        onSave(newDoc);
    };

    const inputClass = "w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-brand-primary focus:outline-none transition";

    return (
        <div className="p-4 bg-gray-100 min-h-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                    <h2 className="font-bold text-lg">Asset Type</h2>
                    <select value={assetType} onChange={e => setAssetType(e.target.value as Document['assetType'])} className={`${inputClass} font-semibold`}>
                        <option value="Vehicle">Vehicle (Car, BodaBoda)</option>
                        <option value="Tool">Power Tool</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                {assetType === 'Vehicle' && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                         <h2 className="font-bold text-lg">Vehicle Details</h2>
                        <input value={regNumber} onChange={e => setRegNumber(e.target.value.toUpperCase())} placeholder="Registration Plate (e.g. KDA 123X)" className={inputClass} required/>
                        <input value={model} onChange={e => setModel(e.target.value)} placeholder="Make & Model (e.g. Toyota Fielder)" className={inputClass} required/>
                        <input value={yom} onChange={e => setYom(e.target.value)} placeholder="Year of Manufacture" className={inputClass} required/>
                    </div>
                )}

                {(assetType === 'Tool' || assetType === 'Electronics' || assetType === 'Other') && (
                     <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                        <h2 className="font-bold text-lg">{assetType} Details</h2>
                        <input value={itemDesc} onChange={e => setItemDesc(e.target.value)} placeholder="Item Name (e.g. Bosch Power Drill)" className={inputClass} required/>
                        <input value={model} onChange={e => setModel(e.target.value)} placeholder="Model Number (Optional)" className={inputClass} />
                        <input value={itemSerial} onChange={e => setItemSerial(e.target.value)} placeholder="Serial Number" className={inputClass} required/>
                    </div>
                )}
                
                 <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                     <h2 className="font-bold text-lg">Images & Documents</h2>
                     <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Asset Photos (up to 4)</label>
                        <div className="grid grid-cols-4 gap-2">
                            {productImages.map((src, i) => <img key={i} src={src} className="w-full h-16 object-cover rounded"/>)}
                            {productImages.length < 4 && <button type="button" onClick={() => productImgRef.current?.click()} className="w-full h-16 border-2 border-dashed rounded flex items-center justify-center text-gray-400">+</button>}
                        </div>
                        <input type="file" ref={productImgRef} onChange={(e) => handleFileChange(e, 'product')} accept="image/*" className="hidden"/>
                    </div>
                     {assetType === 'Vehicle' && (
                         <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Logbook Photo</label>
                            {logbookImage ? <img src={logbookImage} onClick={() => logbookImgRef.current?.click()} className="w-full h-32 object-contain rounded border p-1 cursor-pointer"/> : (
                                <button type="button" onClick={() => logbookImgRef.current?.click()} className="w-full h-24 border-2 border-dashed rounded flex items-center justify-center text-gray-500 text-sm">
                                    Click to Upload
                                </button>
                            )}
                             <input type="file" ref={logbookImgRef} onChange={(e) => handleFileChange(e, 'logbook')} accept="image/*" className="hidden"/>
                        </div>
                     )}
                 </div>

                <button type="submit" className="w-full bg-brand-navy text-white font-bold py-4 rounded-xl shadow-lg">Submit for Verification</button>
            </form>
        </div>
    );
};

export default RegisterAssetView;