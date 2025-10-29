import React, { useState, useRef } from 'react';
import type { Gig } from '../types';

interface CreateGigViewProps {
    onBack: () => void;
    onSave: (gigData: Omit<Gig, 'id' | 'providerId'>) => void;
    categories: string[];
}

const CreateGigView: React.FC<CreateGigViewProps> = ({ onBack, onSave, categories }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(categories[0] || 'Other');
    const [budget, setBudget] = useState('');
    const [budgetType, setBudgetType] = useState<Gig['budgetType']>('fixed');
    const [location, setLocation] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImageUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !budget || !location || !imageUrl) {
            alert('Please fill all fields and upload an image.');
            return;
        }

        const gigData: Omit<Gig, 'id' | 'providerId'> = {
            title,
            description,
            category,
            budget: parseFloat(budget),
            budgetType,
            currency: 'Ksh',
            location,
            imageUrl,
        };
        onSave(gigData);
    };
    
    const inputClass = "w-full p-3 border rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-brand-primary focus:outline-none transition";

    return (
        <div className="bg-gray-50 min-h-full font-sans">
             <header className="p-4 bg-white shadow-sm flex items-center gap-4">
                <button onClick={onBack} className="text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Create a New Gig</h1>
            </header>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div 
                    className="h-40 bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {imageUrl ? (
                        <img src={imageUrl} alt="Gig preview" className="w-full h-full object-cover rounded-xl"/>
                    ) : (
                        <div className="text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <p className="mt-1 text-sm">Upload an Image</p>
                        </div>
                    )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" required/>

                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Gig Title" className={inputClass} required/>
                <select value={category} onChange={e => setCategory(e.target.value)} className={`${inputClass} bg-white`}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                     <option value="Other">Other</option>
                </select>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed Description" rows={5} className={inputClass} required/>
                
                <div className="flex gap-2">
                    <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="Budget (Ksh)" className={inputClass} required/>
                    <select value={budgetType} onChange={e => setBudgetType(e.target.value as Gig['budgetType'])} className={`${inputClass} bg-white`}>
                        <option value="fixed">Fixed</option>
                        <option value="per hour">Per Hour</option>
                        <option value="per day">Per Day</option>
                    </select>
                </div>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location (e.g., Ruaka, Kiambu)" className={inputClass} required/>
                
                <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3 px-4 rounded-full shadow-lg mt-4">
                    Post Gig
                </button>
            </form>
        </div>
    );
};

export default CreateGigView;