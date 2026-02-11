import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Truck, BarChart3, 
  Settings as SettingsIcon, LogOut, Menu, X, Plus, Search,
  AlertTriangle, TrendingUp, DollarSign, User as UserIcon,
  ChevronRight, Printer, FileText, Sparkles, RefreshCw,
  ImageIcon, Upload, Trash2, Edit3, CheckCircle2, Info,
  UserPlus, CreditCard, History, Coins, CloudLightning,
  Palette, Wallet, Save, Minus, ArrowUpDown, Clock as ClockIcon, Activity, 
  Briefcase, Target, Zap, Layers, Filter, ArrowUpRight, Crown,
  Building2, Phone, HandCoins, ExternalLink, ListFilter, MousePointer2, Code,
  Cpu, Database, Share2, Terminal, Monitor, HardDrive, Layout, Maximize2,
  Box, ShieldCheck, ZapOff, Fingerprint, Eye, EyeOff, Image as ImgIcon,
  CalendarDays, ClipboardList, PenTool, ArrowRightLeft, MessageSquarePlus, Check,
  Landmark, AlertCircle, Lightbulb, Trophy, Receipt
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend, ComposedChart, Line, PieChart, Pie } from 'recharts';
import { 
  Product, Customer, Supplier, Sale, ProductCategory, 
  PaymentMethod, User, UserRole, SaleItem, SaleStatus,
  AppSettings, StockAdjustment
} from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_SUPPLIERS, INITIAL_CUSTOMERS, INITIAL_USERS
} from './constants';
import { getInventoryInsights, getBusinessGrowthTips } from './services/geminiService';

// --- Helper: Date Check ---
const isToday = (dateString?: string) => {
  if (!dateString) return false;
  const d = new Date(dateString);
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
};

// --- Apple Style Analog Clock Component ---
const AnalogClock = () => {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="flex items-center space-x-3 bg-slate-900/5 px-4 py-2 rounded-2xl border border-slate-200">
        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 relative shadow-inner flex items-center justify-center overflow-hidden">
            {/* Markers */}
            {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute w-[1px] h-[3px] bg-slate-500 origin-center" style={{transform: `rotate(${i * 30}deg) translate(0, -16px)`}} />
            ))}
            {/* Hour Hand */}
            <div className="absolute w-[2px] h-2.5 bg-white rounded-full origin-bottom bottom-1/2 left-[calc(50%-1px)]" style={{transform: `rotate(${hourAngle}deg)`}} />
            {/* Minute Hand */}
            <div className="absolute w-[1.5px] h-3.5 bg-slate-300 rounded-full origin-bottom bottom-1/2 left-[calc(50%-0.75px)]" style={{transform: `rotate(${minuteAngle}deg)`}} />
            {/* Second Hand */}
            <div className="absolute w-[1px] h-4.5 bg-orange-500 rounded-full origin-bottom bottom-1/2 left-[calc(50%-0.5px)] shadow-[0_0_4px_rgba(249,115,22,0.5)]" style={{transform: `rotate(${secondAngle}deg)`}} />
            {/* Center Dot */}
            <div className="w-1 h-1 bg-orange-500 rounded-full z-10 border border-slate-900" />
        </div>
        <div className="flex flex-col items-start">
            <span className="text-sm font-black tracking-tighter leading-none text-slate-800">{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Live</span>
        </div>
    </div>
  );
};

// --- Add Request Modal ---
const ProductRequestModal = ({ isOpen, onClose, onSave, theme, radiusClass }: any) => {
    const [name, setName] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        if (!name) return;
        onSave({ id: Date.now().toString(), name, customerName, note, date: new Date().toISOString() });
        setName(''); setCustomerName(''); setNote('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            <div className={`relative w-full max-w-sm bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 ${radiusClass}`}>
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black uppercase text-xs tracking-widest text-slate-500">Mpango wa Manunuzi</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-rose-500"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Jina la Bidhaa</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-blue-400" placeholder="Mfano: Side Mirror za BMW" autoFocus />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Mteja / Matumizi (Hiari)</label>
                        <input value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-blue-400" placeholder="Jina la mteja au Matumizi ya duka" />
                    </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Maelezo ya Ziada</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none h-20 resize-none" placeholder="Maelezo..." />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                   <button onClick={handleSubmit} className={`px-6 py-3 ${theme.bg} text-white rounded-xl font-bold text-xs uppercase shadow-lg hover:opacity-90 active:scale-95 transition-all`}>Hifadhi Kwenye Mpango</button>
                </div>
            </div>
        </div>
    );
};

// --- Product Details Modal ---
const ProductDetailsModal = ({ product, isOpen, onClose, onDelete, theme, settings }: any) => {
  if (!isOpen || !product) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="aspect-video bg-slate-100 flex items-center justify-center relative shrink-0">
           {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <Box size={64} className="text-slate-200" />}
           <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur shadow-xl rounded-full hover:bg-white"><X size={20} /></button>
        </div>
        <div className="p-8 space-y-6 flex-1">
           <div>
              <span className={`px-3 py-1 rounded-full ${theme.light} ${theme.text} text-[9px] font-black uppercase tracking-widest`}>{product.category}</span>
              <h3 className="text-xl font-black text-slate-900 mt-2">{product.name}</h3>
              <p className="text-slate-400 text-xs font-bold uppercase">{product.brand} • {product.model}</p>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-3xl">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Bei ya Kuuza</p>
                 <p className="text-base font-black text-blue-600">{settings.currency} {product.sellingPrice.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-3xl">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Stoo Iliyobaki</p>
                 <p className="text-base font-black text-slate-900">{product.stockQuantity} <span className="text-xs text-slate-400 font-bold">PCS</span></p>
              </div>
           </div>
           <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Faida kwa Unit</p>
              <p className="text-sm font-black text-emerald-600">
                 {settings.currency} {(product.sellingPrice - product.costPrice).toLocaleString()}
                 <span className="text-[10px] text-slate-400 ml-2">({(((product.sellingPrice - product.costPrice) / product.costPrice) * 100).toFixed(1)}%)</span>
              </p>
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Maelezo ya Bidhaa</p>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{product.description || "Hakuna maelezo ya ziada kwa bidhaa hii."}</p>
           </div>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <button 
                onClick={() => {
                    if(window.confirm("Je, una uhakika unataka kufuta bidhaa hii kabisa?")) {
                        onDelete(product.id);
                        onClose();
                    }
                }}
                className="flex items-center space-x-2 text-rose-500 hover:text-rose-700 hover:bg-rose-100 px-4 py-2 rounded-xl transition-all"
            >
                <Trash2 size={18} />
                <span className="text-xs font-black uppercase">Futa Bidhaa</span>
            </button>
            <button onClick={onClose} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase shadow-lg hover:opacity-90">Funga</button>
        </div>
      </div>
    </div>
  );
};

// --- Advanced Stock Action Modal ---
const StockActionModal = ({ isOpen, onClose, product, onConfirm, onDelete, theme, radiusClass, settings }: any) => {
  const [actionType, setActionType] = useState<'restock' | 'adjustment'>('restock');
  const [qty, setQty] = useState('');
  const [newCostPrice, setNewCostPrice] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (product) {
      setNewCostPrice(product.costPrice.toString());
      setQty('');
      setReason('');
      setActionType('restock');
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = () => {
    const quantity = parseInt(qty);
    if (isNaN(quantity) || quantity <= 0) return alert("Weka idadi sahihi");
    
    onConfirm({
        productId: product.id,
        type: actionType,
        quantity: quantity,
        newCostPrice: actionType === 'restock' ? Number(newCostPrice) : product.costPrice,
        reason: reason || (actionType === 'restock' ? 'Mzigo Mpya' : 'Marekebisho ya Stoo')
    });
    onClose();
  };

  const handleDelete = () => {
      if (window.confirm(`ONYO: Unakaribia kufuta "${product.name}" kabisa kwenye mfumo.\n\nHatua hii haiwezi kurudishwa. Je, una uhakika?`)) {
          onDelete(product.id);
          onClose();
      }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className={`relative w-full max-w-md bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 ${radiusClass}`}>
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
           <div>
             <h3 className="font-black uppercase text-xs tracking-widest text-slate-500">Meneja wa Stoo</h3>
             <p className="text-base font-black text-slate-900 mt-1">{product.name}</p>
           </div>
           <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-rose-500"/></button>
        </div>
        
        <div className="p-6 space-y-6">
           {/* Tabs */}
           <div className="flex p-1 bg-slate-100 rounded-xl">
              <button 
                onClick={() => setActionType('restock')} 
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all flex items-center justify-center space-x-2 ${actionType === 'restock' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Truck size={14} /><span>Mzigo Mpya</span>
              </button>
              <button 
                onClick={() => setActionType('adjustment')} 
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all flex items-center justify-center space-x-2 ${actionType === 'adjustment' ? 'bg-white shadow text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ArrowRightLeft size={14} /><span>Marekebisho</span>
              </button>
           </div>

           <div className="space-y-4">
              <div className="flex space-x-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Idadi ya {actionType === 'restock' ? 'Kuongeza' : 'Kurekebisha'}</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={qty} 
                            onChange={(e) => setQty(e.target.value)} 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-lg outline-none focus:border-blue-400"
                            placeholder="0"
                            autoFocus
                        />
                    </div>
                  </div>
                  {actionType === 'restock' && (
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Bei ya Kununua (Mpya)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={newCostPrice} 
                                onChange={(e) => setNewCostPrice(e.target.value)} 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg outline-none focus:border-blue-400"
                            />
                            <span className="absolute right-3 top-3.5 text-xs font-black text-slate-400">{settings.currency}</span>
                        </div>
                      </div>
                  )}
              </div>

              {actionType === 'adjustment' && (
                 <div className="p-3 bg-amber-50 rounded-xl text-amber-800 text-xs font-medium border border-amber-100 flex items-start space-x-2">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    <p>Tumia hasi (-) kupunguza stoo (mfano: kuharibika, wizi) na chanya (+) kuongeza (mfano: marejesho).</p>
                 </div>
              )}

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400">Sababu / Maelezo</label>
                 <textarea 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)} 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none h-20 resize-none"
                    placeholder={actionType === 'restock' ? "Mfano: Risiti #1234 kutoka Yamaha" : "Mfano: Imevunjika wakati wa kupanga"} 
                 />
              </div>

              <div className="flex justify-between items-center text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
                  <span>Stoo ya sasa:</span>
                  <span className="font-black text-slate-900">{product.stockQuantity}</span>
              </div>
           </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center space-x-3">
           <button 
                onClick={handleDelete}
                className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                title="Futa Bidhaa Kabisa"
           >
                <Trash2 size={18} />
           </button>
           <div className="flex space-x-3">
                <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-xs uppercase text-slate-500 hover:bg-slate-200 transition-colors">Ghairi</button>
                <button onClick={handleSubmit} className={`px-6 py-3 ${theme.bg} text-white rounded-xl font-bold text-xs uppercase shadow-lg hover:opacity-90 active:scale-95 transition-all`}>
                    Thibitisha
                </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Add Product Modal ---
const AddProductModal = ({ isOpen, onClose, onSave, theme, settings, radiusClass }: any) => {
    const [formData, setFormData] = useState({
        name: '', brand: '', model: '', category: 'Pikipiki',
        costPrice: '', sellingPrice: '', stockQuantity: '', reorderLevel: '5',
        description: '', imageUrl: ''
    });
    
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                setFormData({ ...formData, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if(!formData.name || !formData.sellingPrice) return alert("Jaza taarifa muhimu!");
        onSave({
            ...formData,
            costPrice: Number(formData.costPrice),
            sellingPrice: Number(formData.sellingPrice),
            stockQuantity: Number(formData.stockQuantity),
            reorderLevel: Number(formData.reorderLevel)
        });
        setFormData({ name: '', brand: '', model: '', category: 'Pikipiki', costPrice: '', sellingPrice: '', stockQuantity: '', reorderLevel: '5', description: '', imageUrl: '' });
        setPreviewImage(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            <div className={`relative w-full max-w-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] ${radiusClass}`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-black uppercase text-sm tracking-widest text-slate-900">Ongeza Bidhaa Mpya</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-rose-500" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Picha ya Bidhaa</label>
                                <div className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden hover:border-blue-400 transition-colors group">
                                    {previewImage ? (
                                        <img src={previewImage} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2 text-slate-400"><ImgIcon size={20} /></div>
                                            <p className="text-[10px] font-bold text-slate-400">Bonyeza kuweka picha</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    {previewImage && <button onClick={(e) => {e.stopPropagation(); setPreviewImage(null); setFormData({...formData, imageUrl: ''})}} className="absolute top-2 right-2 p-1 bg-white/80 rounded-full shadow hover:bg-rose-50 hover:text-rose-500"><X size={14} /></button>}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div><label className="text-[10px] font-black uppercase text-slate-400">Jina la Bidhaa</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-xs border border-slate-100 focus:border-blue-500 outline-none" placeholder="Mfano: Boxer 150" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-[10px] font-black uppercase text-slate-400">Brand</label><input value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-xs border border-slate-100 outline-none" placeholder="Bajaj" /></div>
                                <div><label className="text-[10px] font-black uppercase text-slate-400">Model</label><input value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-xs border border-slate-100 outline-none" placeholder="2024" /></div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400">Kundi (Category)</label>
                                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-xs border border-slate-100 outline-none">
                                    <option value="Pikipiki">Pikipiki</option>
                                    <option value="Vipuri">Vipuri</option>
                                    <option value="Vifaa vya Ziada">Vifaa vya Ziada</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-[10px] font-black uppercase text-slate-400">Bei ya Kununua</label><input type="number" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-xs border border-slate-100 outline-none" placeholder="0" /></div>
                                <div><label className="text-[10px] font-black uppercase text-slate-400">Bei ya Kuuza</label><input type="number" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-xs border border-slate-100 outline-none" placeholder="0" /></div>
                            </div>
                             <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-[10px] font-black uppercase text-slate-400">Idadi Stoo</label><input type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-xs border border-slate-100 outline-none" placeholder="0" /></div>
                                <div><label className="text-[10px] font-black uppercase text-slate-400">Alert Level</label><input type="number" value={formData.reorderLevel} onChange={e => setFormData({...formData, reorderLevel: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-xs border border-slate-100 outline-none" placeholder="5" /></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="text-[10px] font-black uppercase text-slate-400">Maelezo ya Ziada</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-xs border border-slate-100 outline-none h-24 resize-none" placeholder="Maelezo kuhusu bidhaa..." />
                    </div>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button onClick={handleSubmit} className={`px-8 py-3 ${theme.bg} text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center space-x-2`}>
                        <Save size={16} /><span>Hifadhi Bidhaa</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Define THEME_COLORS and SidebarItem ---
const THEME_COLORS: Record<string, any> = {
  blue: { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-600', shadow: 'shadow-blue-200', hex: '#2563eb' },
  indigo: { bg: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-600', shadow: 'shadow-indigo-200', hex: '#4f46e5' },
  emerald: { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', shadow: 'shadow-emerald-200', hex: '#059669' },
  rose: { bg: 'bg-rose-600', light: 'bg-rose-50', text: 'text-rose-600', shadow: 'shadow-rose-200', hex: '#e11d48' },
  slate: { bg: 'bg-slate-800', light: 'bg-slate-100', text: 'text-slate-800', shadow: 'shadow-slate-200', hex: '#1e293b' }
};

const SidebarItem = ({ icon: Icon, label, active, onClick, isCollapsed, theme, isPulsing }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all group relative ${active ? `${theme.bg} text-white shadow-lg` : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${isPulsing && active ? 'pulse-card-bounce' : ''}`}
  >
    <Icon size={20} className={active ? 'text-white' : 'group-hover:text-white'} />
    {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2 duration-300">{label}</span>}
    {active && <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />}
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser] = useState<User>(INITIAL_USERS[0]);

  const [settings, setSettings] = useState<AppSettings & { uiDensity: 'compact' | 'relaxed', cornerRadius: 'none' | 'md' | 'full', sidebarMode: 'expanded' | 'collapsed' }>(() => {
    const saved = localStorage.getItem('moto_settings');
    return saved ? JSON.parse(saved) : { 
      shopName: "MOTOSTOCK PRO", 
      currency: "TSh", 
      taxRate: 0, 
      lowStockAlertLevel: 3, 
      themeColor: 'blue', 
      enableAiInsights: true,
      uiDensity: 'relaxed',
      cornerRadius: 'full',
      sidebarMode: 'expanded'
    };
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('moto_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('moto_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('moto_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  
  const [productRequests, setProductRequests] = useState<any[]>(() => {
      const saved = localStorage.getItem('moto_requests');
      return saved ? JSON.parse(saved) : [];
  });

  const theme = THEME_COLORS[settings.themeColor] || THEME_COLORS.blue;
  const radiusClass = settings.cornerRadius === 'full' ? 'rounded-[32px]' : settings.cornerRadius === 'md' ? 'rounded-xl' : 'rounded-none';

  useEffect(() => {
    localStorage.setItem('moto_settings', JSON.stringify(settings));
    localStorage.setItem('moto_products', JSON.stringify(products));
    localStorage.setItem('moto_sales', JSON.stringify(sales));
    localStorage.setItem('moto_customers', JSON.stringify(customers));
    localStorage.setItem('moto_requests', JSON.stringify(productRequests));
  }, [settings, products, sales, customers, productRequests]);

  // --- Handlers ---
  
  const handleCreateSale = (saleData: any) => {
    const newSale: Sale = { 
        ...saleData, 
        id: `S${Date.now()}`, 
        userId: currentUser.id, 
        status: SaleStatus.PAID,
        // Ensure date is taken from saleData if present
        date: saleData.date || new Date().toISOString(),
        paidAt: saleData.date || new Date().toISOString()
    };
    setProducts(prev => prev.map(p => {
      const soldItem = saleData.items.find((item: any) => item.productId === p.id);
      if (soldItem) return { ...p, stockQuantity: Math.max(0, p.stockQuantity - soldItem.quantity) };
      return p;
    }));
    setSales(prev => [newSale, ...prev]);
    setActiveTab('sales-history');
  };
  
  const [stockActionProduct, setStockActionProduct] = useState<Product | null>(null);

  const handleStockActionRequest = (productId: string) => {
      const product = products.find(p => p.id === productId);
      if (product) setStockActionProduct(product);
  };

  const handleStockActionConfirm = (data: { productId: string, type: 'restock' | 'adjustment', quantity: number, newCostPrice: number, reason: string }) => {
      setProducts(prev => prev.map(p => {
          if (p.id === data.productId) {
              const newQty = p.stockQuantity + data.quantity;
              return { 
                  ...p, 
                  stockQuantity: Math.max(0, newQty),
                  // Update cost price only if it's a restock and different
                  costPrice: data.type === 'restock' ? data.newCostPrice : p.costPrice 
              };
          }
          return p;
      }));
      setStockActionProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAddProduct = (productData: any) => {
      const newProduct: Product = {
          id: `p${Date.now()}`,
          sku: `SKU-${Math.floor(Math.random() * 10000)}`,
          supplierId: 'sup1', // Default
          ...productData
      };
      setProducts(prev => [newProduct, ...prev]);
  };
  
  const handleAddRequest = (request: any) => {
      setProductRequests(prev => [request, ...prev]);
  };
  
  const handleDeleteRequest = (id: string) => {
      setProductRequests(prev => prev.filter(r => r.id !== id));
  };

  // --- Derived Stats ---

  const todaySales = useMemo(() => {
    const today = new Date().toLocaleDateString();
    return sales.filter(s => new Date(s.date).toLocaleDateString() === today);
  }, [sales]);

  const todayStats = useMemo(() => {
    const revenueSales = sales.filter(s => {
        return s.status === SaleStatus.PAID && (isToday(s.date) || (s.paidAt && isToday(s.paidAt)));
    });

    const revenue = revenueSales.reduce((acc, s) => acc + s.grandTotal, 0);
    
    const profit = revenueSales.reduce((total, sale) => {
        const saleProfit = sale.items.reduce((acc, item) => {
            const itemProfit = (item.unitPrice - item.unitCost) * item.quantity;
            return acc + itemProfit;
        }, 0);
        return total + saleProfit - (sale.discountTotal || 0);
    }, 0);
    
    return { revenue, profit, count: todaySales.length };
  }, [todaySales, sales]);

  const inventoryStats = useMemo(() => {
    const value = products.reduce((acc, p) => acc + (p.costPrice * p.stockQuantity), 0);
    const lowStock = products.filter(p => p.stockQuantity <= (p.reorderLevel || settings.lowStockAlertLevel));
    return { value, lowCount: lowStock.length, lowStock };
  }, [products, settings.lowStockAlertLevel]);

  return (
    <div className={`flex h-screen bg-slate-50 text-slate-900 overflow-hidden ${settings.uiDensity === 'compact' ? 'text-[12px]' : 'text-[13px]'}`}>
      
      <StockActionModal 
        isOpen={!!stockActionProduct} 
        onClose={() => setStockActionProduct(null)} 
        product={stockActionProduct} 
        onConfirm={handleStockActionConfirm}
        onDelete={handleDeleteProduct} // PASSED HERE
        theme={theme} 
        radiusClass={radiusClass} 
        settings={settings}
      />

      <aside className={`pro-sidebar text-white transition-all duration-300 h-full flex flex-col z-50 ${isSidebarOpen ? 'w-60' : 'w-20'} no-print`}>
        <div className="p-6 flex items-center space-x-3">
          <div className={`${theme.bg} p-2.5 rounded-xl shrink-0`}><Layers size={22} className="text-white" /></div>
          {isSidebarOpen && <div className="animate-in fade-in duration-500"><h1 className="text-lg font-black tracking-tighter uppercase">{settings.shopName.split(' ')[0]} <span className={theme.text}>PRO</span></h1></div>}
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem theme={theme} icon={LayoutDashboard} label="DASHIBODI" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} isCollapsed={!isSidebarOpen} />
          <SidebarItem theme={theme} icon={Package} label="STOO" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} isCollapsed={!isSidebarOpen} />
          <SidebarItem theme={theme} icon={ShoppingCart} label="MAUZO" active={activeTab === 'new-sale'} onClick={() => setActiveTab('new-sale')} isCollapsed={!isSidebarOpen} />
          <SidebarItem theme={theme} icon={FileText} label="REKODI" active={activeTab === 'sales-history'} onClick={() => setActiveTab('sales-history')} isCollapsed={!isSidebarOpen} />
          <SidebarItem theme={theme} icon={BarChart3} label="RIPOTI" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} isCollapsed={!isSidebarOpen} />
          <div className="py-2"><div className="h-px bg-white/5 mx-2" /></div>
          <SidebarItem theme={theme} icon={SettingsIcon} label="MIPANGILIO" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} isCollapsed={!isSidebarOpen} />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 glass-card border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"><Menu size={20} /></button>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center space-x-4">
             <AnalogClock />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'dashboard' && <DashboardView stats={todayStats} invStats={inventoryStats} lowStock={inventoryStats.lowStock} onStockAction={handleStockActionRequest} settings={settings} theme={theme} radiusClass={radiusClass} sales={sales} productRequests={productRequests} onRequestAdd={handleAddRequest} onRequestDelete={handleDeleteRequest} />}
          {activeTab === 'inventory' && <InventoryView products={products} onAddProduct={handleAddProduct} onStockAction={handleStockActionRequest} onDeleteProduct={handleDeleteProduct} settings={settings} theme={theme} radiusClass={radiusClass} />}
          {activeTab === 'new-sale' && <SalePOS products={products} customers={customers} settings={settings} theme={theme} onCreateSale={handleCreateSale} radiusClass={radiusClass} />}
          {activeTab === 'sales-history' && <SalesHistoryView sales={sales} settings={settings} theme={theme} radiusClass={radiusClass} />}
          {activeTab === 'reports' && <ReportsView sales={sales} products={products} settings={settings} theme={theme} radiusClass={radiusClass} />}
          {activeTab === 'settings' && <SettingsView settings={settings} setSettings={setSettings} theme={theme} radiusClass={radiusClass} />}
        </div>
      </main>
    </div>
  );
}

// ... DashboardView Component ...

function InventoryView({ products, onAddProduct, onStockAction, onDeleteProduct, settings, theme, radiusClass }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p: Product) => 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'All' || p.category === filterCategory)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stoo & Bidhaa</h2>
            <p className="text-slate-500 text-xs font-medium mt-1">Dhibiti bidhaa, bei, na idadi stoo.</p>
         </div>
         <button onClick={() => setAddModalOpen(true)} className={`px-6 py-3 ${theme.bg} text-white ${radiusClass} shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95 transition-all flex items-center space-x-2`}>
            <Plus size={18} /> <span className="text-xs font-black uppercase tracking-widest">Ongeza Bidhaa</span>
         </button>
      </div>

      <div className={`glass-card p-4 ${radiusClass} border border-slate-200 flex flex-col md:flex-row gap-4 items-center`}>
         <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tafuta kwa jina au SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-100 ${radiusClass} font-bold text-slate-700 placeholder:text-slate-400`}
            />
         </div>
         <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['All', 'Pikipiki', 'Vipuri', 'Vifaa vya Ziada'].map(cat => (
               <button 
                 key={cat} 
                 onClick={() => setFilterCategory(cat)}
                 className={`px-4 py-2 whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${filterCategory === cat ? `${theme.bg} text-white shadow-md` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} ${radiusClass}`}
               >
                 {cat}
               </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {filteredProducts.map((product: Product) => (
            <div key={product.id} className={`group bg-white p-5 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 ${radiusClass} relative flex flex-col`}>
               {/* Header Actions - Always Visible */}
               <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center space-x-2">
                       <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${product.stockQuantity <= (product.reorderLevel || 5) ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                           {product.stockQuantity <= (product.reorderLevel || 5) ? 'Low Stock' : 'In Stock'}
                       </span>
                   </div>
                   <div className="flex space-x-1">
                       <button onClick={(e) => {e.stopPropagation(); setSelectedProduct(product);}} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={16} /></button>
                       <button 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onDeleteProduct(product.id);
                            }} 
                            className="p-2 bg-rose-50 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors shadow-sm"
                            title="Futa Bidhaa (Mandate)"
                       >
                            <Trash2 size={16} />
                       </button>
                   </div>
               </div>
               
               {/* Content */}
               <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                     {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover rounded-xl" /> : <Package size={24} className="text-slate-300" />}
                  </div>
                  <div className="min-w-0 flex-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{product.brand}</p>
                     <h3 className="font-black text-slate-800 text-sm truncate">{product.name}</h3>
                     <p className="font-black text-blue-600 mt-1">{settings.currency} {product.sellingPrice.toLocaleString()}</p>
                  </div>
               </div>

               {/* Footer Action */}
               <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex flex-col">
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Stoo</span>
                       <span className="font-black text-slate-900">{product.stockQuantity}</span>
                   </div>
                   <button onClick={() => onStockAction(product.id)} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-wide rounded-lg hover:bg-slate-800 flex items-center space-x-2">
                      <Truck size={12} /><span>Dhibiti</span>
                   </button>
               </div>
            </div>
         ))}
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onSave={onAddProduct} 
        theme={theme} 
        settings={settings}
        radiusClass={radiusClass}
      />

      <ProductDetailsModal 
         product={selectedProduct} 
         isOpen={!!selectedProduct} 
         onClose={() => setSelectedProduct(null)} 
         onDelete={onDeleteProduct}
         theme={theme}
         settings={settings}
      />
    </div>
  );
}

function DashboardView({ stats, invStats, lowStock, onStockAction, settings, theme, radiusClass, sales, productRequests, onRequestAdd, onRequestDelete }: any) {
  const [aiInsight, setAiInsight] = useState('');
  const [growthTip, setGrowthTip] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);

  useEffect(() => {
    if (settings.enableAiInsights && !aiInsight && sales.length > 0) {
      setLoadingAi(true);
      // Fetch concurrently
      Promise.all([
        getInventoryInsights(lowStock, sales),
        getBusinessGrowthTips(lowStock, sales)
      ]).then(([insight, tip]) => {
        setAiInsight(insight);
        setGrowthTip(tip);
        setLoadingAi(false);
      });
    }
  }, [settings.enableAiInsights, sales, lowStock]);

  // Derive Top 5 Products
  const topProducts = useMemo(() => {
      const productSales: Record<string, {name: string, quantity: number, total: number}> = {};
      sales.forEach((s: Sale) => {
          s.items.forEach((item: SaleItem) => {
              if (productSales[item.productId]) {
                  productSales[item.productId].quantity += item.quantity;
                  productSales[item.productId].total += item.total;
              } else {
                  productSales[item.productId] = { name: item.name, quantity: item.quantity, total: item.total };
              }
          });
      });
      return Object.values(productSales).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  }, [sales]);

  // Recent Sales
  const recentSales = sales.slice(0, 7);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       {/* Top Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue, Profit, Sales Count, Inventory Value */}
          <StatCard title="Mapato Leo" value={`${settings.currency} ${stats.revenue.toLocaleString()}`} icon={DollarSign} theme={theme} />
          <StatCard title="Faida Leo" value={`${settings.currency} ${stats.profit.toLocaleString()}`} icon={TrendingUp} theme={theme} color="emerald" />
          <StatCard title="Mauzo Leo" value={stats.count} icon={ShoppingCart} theme={theme} color="blue" />
          <StatCard title="Thamani ya Stoo" value={`${settings.currency} ${invStats.value.toLocaleString()}`} icon={Package} theme={theme} color="indigo" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Low Stock & AI */}
          <div className="space-y-6">
             {/* Low Stock Alert */}
             <div className={`bg-white border border-rose-100 p-6 ${radiusClass} h-fit`}>
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center space-x-2 text-rose-600">
                      <AlertTriangle size={20} />
                      <h3 className="font-black uppercase text-sm tracking-widest">Bidhaa Zinaisha</h3>
                   </div>
                   <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded text-[10px] font-black">{lowStock.length} Items</span>
                </div>
                {lowStock.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">Stoo ipo vizuri!</div>
                ) : (
                    <div className="space-y-3">
                        {lowStock.slice(0, 5).map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-xl">
                                <div>
                                    <p className="font-bold text-xs text-slate-800 line-clamp-1">{p.name}</p>
                                    <p className="text-[10px] text-slate-500">Baki: {p.stockQuantity} (Reorder: {p.reorderLevel})</p>
                                </div>
                                <button onClick={() => onStockAction(p.id)} className="px-3 py-1.5 bg-white border border-rose-200 text-rose-600 text-[10px] font-black uppercase rounded-lg hover:bg-rose-600 hover:text-white transition-colors">Agiza</button>
                            </div>
                        ))}
                    </div>
                )}
             </div>

             {/* AI Insights */}
             {settings.enableAiInsights && (
               <div className={`p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden ${radiusClass}`}>
                  <div className="flex items-center space-x-2 mb-4">
                     <Sparkles className="text-yellow-400 animate-pulse" />
                     <h3 className="font-black uppercase tracking-widest text-sm">AI Business Analyst</h3>
                  </div>
                  {loadingAi ? (
                     <div className="h-24 flex items-center justify-center text-slate-400 text-xs animate-pulse">Inachambua biashara yako...</div>
                  ) : (
                     <div className="space-y-4">
                        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                           <p className="text-lg font-bold text-yellow-300 mb-1">💡 Ushauri wa Leo</p>
                           <p className="text-sm font-medium leading-relaxed opacity-90">{growthTip || "Endelea kuuza! Data zaidi zinahitajika kwa ushauri."}</p>
                        </div>
                     </div>
                  )}
               </div>
             )}
          </div>

          {/* Middle Column: Recent Sales */}
          <div className={`bg-white border border-slate-200 p-6 ${radiusClass}`}>
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-black uppercase text-sm tracking-widest text-slate-700">Mauzo ya Hivi Punde</h3>
                <Receipt size={18} className="text-slate-400"/>
             </div>
             <div className="space-y-3">
                {recentSales.length === 0 ? <p className="text-xs text-slate-400 text-center py-4">Hakuna mauzo bado</p> : recentSales.map((sale: any) => (
                   <div key={sale.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                      <div>
                          <p className="font-bold text-xs text-slate-800">{sale.customerName}</p>
                          <p className="text-[10px] text-slate-500">{new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {sale.items.length} items</p>
                      </div>
                      <span className="font-black text-xs text-slate-900">{settings.currency} {sale.grandTotal.toLocaleString()}</span>
                   </div>
                ))}
             </div>
          </div>

          {/* Right Column: Shop Plan / Requests */}
          <div className={`bg-white border border-slate-200 p-6 ${radiusClass} h-full`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-black uppercase text-sm tracking-widest text-slate-700">Mpango wa Manunuzi</h3>
                <button onClick={() => setRequestModalOpen(true)} className={`p-2 ${theme.bg} text-white rounded-lg hover:opacity-90`}><Plus size={16}/></button>
            </div>
            <div className="space-y-3">
                {productRequests.length === 0 ? <p className="text-xs text-slate-400 text-center py-4">Orodha ni tupu</p> : productRequests.map((req: any) => (
                <div key={req.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative group flex justify-between items-center">
                    <div>
                        <p className="font-bold text-xs text-slate-800">{req.name}</p>
                        <p className="text-[10px] text-slate-500">{req.customerName ? `Kwa: ${req.customerName}` : 'Duka'} • {new Date(req.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                         <button 
                            onClick={() => onRequestDelete(req.id)} 
                            className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
                            title="Imefika / Weka Stoo"
                         >
                            <Check size={14}/>
                         </button>
                         <button onClick={() => onRequestDelete(req.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"><X size={14}/></button>
                    </div>
                </div>
                ))}
            </div>
          </div>
       </div>
       <ProductRequestModal isOpen={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} onSave={onRequestAdd} theme={theme} radiusClass={radiusClass} />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, theme, color = 'slate' }: any) {
    const colors: any = {
        slate: 'text-slate-600 bg-slate-100',
        emerald: 'text-emerald-600 bg-emerald-100',
        blue: 'text-blue-600 bg-blue-100',
        indigo: 'text-indigo-600 bg-indigo-100',
        rose: 'text-rose-600 bg-rose-100',
    };
    return (
        <div className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4`}>
            <div className={`p-4 rounded-2xl ${colors[color] || colors.slate}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{title}</p>
                <p className="text-xl font-black text-slate-900 mt-1">{value}</p>
            </div>
        </div>
    )
}

function SalePOS({ products, customers, settings, theme, onCreateSale, radiusClass }: any) {
   const [cart, setCart] = useState<any[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
   const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);
   const [amountPaid, setAmountPaid] = useState('');

   const filteredProducts = products.filter((p: any) => 
     p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.sku.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const addToCart = (product: any) => {
      if (product.stockQuantity <= 0) return alert("Bidhaa imeisha stoo!");
      setCart(prev => {
         const existing = prev.find(item => item.productId === product.id);
         if (existing) {
             if (existing.quantity >= product.stockQuantity) return prev;
             return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice } : item);
         }
         return [...prev, { productId: product.id, name: product.name, quantity: 1, unitPrice: product.sellingPrice, unitCost: product.costPrice, discount: 0, total: product.sellingPrice }];
      });
   };

   const updateQuantity = (productId: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.productId === productId) {
             const newQty = Math.max(1, item.quantity + delta);
             const product = products.find((p: any) => p.id === productId);
             if (product && newQty > product.stockQuantity) return item;
             return { ...item, quantity: newQty, total: newQty * item.unitPrice };
          }
          return item;
      }));
   };

   const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.productId !== productId));

   const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
   const tax = subtotal * settings.taxRate;
   const total = subtotal + tax;

   const handleCheckout = () => {
       if (cart.length === 0) return;
       
       const now = new Date();
       const timePart = now.toTimeString().split(' ')[0];
       const fullDate = new Date(`${saleDate}T${timePart}`);

       onCreateSale({
           customerId: 'walk-in',
           customerName: 'Mteja',
           items: cart,
           subtotal,
           tax,
           discountTotal: 0,
           grandTotal: total,
           paymentMethod,
           date: fullDate.toISOString()
       });
       setCart([]);
   };

   return (
       <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
           {/* Products Grid */}
           <div className="flex-1 flex flex-col min-w-0">
               <div className={`glass-card p-4 mb-4 ${radiusClass} border border-slate-200 flex items-center space-x-3`}>
                   <Search className="text-slate-400" />
                   <input 
                      autoFocus
                      className="flex-1 bg-transparent outline-none font-bold text-slate-700" 
                      placeholder="Tafuta bidhaa kwa jina au SKU..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                   />
               </div>
               <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-1 custom-scrollbar pb-20">
                   {filteredProducts.map((product: any) => (
                       <button 
                         key={product.id} 
                         onClick={() => addToCart(product)}
                         className={`bg-white ${radiusClass} border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all text-left flex flex-col group relative overflow-hidden h-64`}
                       >
                           <div className="h-32 w-full bg-slate-50 relative">
                               {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={32}/></div>}
                               <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-600 shadow-sm border border-slate-100">
                                   {product.stockQuantity} Left
                               </div>
                           </div>
                           <div className="p-4 flex flex-col flex-1">
                               <p className="text-[9px] font-black uppercase text-slate-400 mb-1">{product.brand}</p>
                               <p className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight mb-auto">{product.name}</p>
                               <div className="mt-2">
                                   <p className={`font-black ${theme.text} text-lg`}>{settings.currency} {product.sellingPrice.toLocaleString()}</p>
                               </div>
                           </div>
                           {product.stockQuantity <= 0 && (
                               <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                                   <span className="bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2 rounded-xl font-black text-xs uppercase shadow-sm">Sold Out</span>
                               </div>
                           )}
                       </button>
                   ))}
               </div>
           </div>

           {/* Cart Sidebar */}
           <div className={`w-full lg:w-96 bg-white ${radiusClass} shadow-2xl border border-slate-200 flex flex-col`}>
               <div className="p-6 border-b border-slate-100 bg-slate-50 rounded-t-[inherit]">
                   <h3 className="font-black uppercase text-sm tracking-widest text-slate-800">Mkokoteni</h3>
                   <div className="mt-4 space-y-3">
                       <div>
                           <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Tarehe ya Mauzo</label>
                           <input 
                               type="date" 
                               value={saleDate} 
                               onChange={e => setSaleDate(e.target.value)} 
                               className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none font-mono text-slate-700"
                           />
                       </div>
                   </div>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                   {cart.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-3">
                           <ShoppingCart size={48} strokeWidth={1} />
                           <p className="text-xs font-bold">Chagua bidhaa kuanza</p>
                       </div>
                   ) : (
                       cart.map(item => (
                           <div key={item.productId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                               <div className="flex-1 min-w-0 mr-3">
                                   <p className="font-bold text-xs text-slate-800 truncate">{item.name}</p>
                                   <p className="text-[10px] text-slate-500">{settings.currency} {item.unitPrice.toLocaleString()} x {item.quantity}</p>
                               </div>
                               <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-1">
                                   <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Minus size={12} /></button>
                                   <span className="text-xs font-black min-w-[16px] text-center">{item.quantity}</span>
                                   <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Plus size={12} /></button>
                               </div>
                               <button onClick={() => removeFromCart(item.productId)} className="ml-2 p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={14} /></button>
                           </div>
                       ))
                   )}
               </div>

               <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3 rounded-b-[inherit]">
                   <div className="space-y-1 text-xs">
                       <div className="flex justify-between text-slate-500"><span>Jumla Ndogo</span><span className="font-bold">{settings.currency} {subtotal.toLocaleString()}</span></div>
                       <div className="flex justify-between text-slate-500"><span>Kodi ({settings.taxRate * 100}%)</span><span className="font-bold">{settings.currency} {tax.toLocaleString()}</span></div>
                       <div className="flex justify-between text-slate-900 text-lg font-black pt-2 border-t border-slate-200 mt-2"><span>Jumla Kuu</span><span>{settings.currency} {total.toLocaleString()}</span></div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2 pt-2">
                       {Object.values(PaymentMethod).map(method => (
                           <button 
                                key={method} 
                                onClick={() => setPaymentMethod(method)}
                                className={`py-2 text-[9px] font-black uppercase border rounded-lg transition-all ${paymentMethod === method ? `${theme.bg} text-white border-transparent` : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                           >
                               {method}
                           </button>
                       ))}
                   </div>

                   <button 
                       disabled={cart.length === 0} 
                       onClick={handleCheckout}
                       className={`w-full py-4 ${cart.length === 0 ? 'bg-slate-300 cursor-not-allowed' : theme.bg} text-white font-black uppercase text-sm tracking-widest rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2`}
                   >
                       <CheckCircle2 size={18} /><span>Kamilisha Mauzo</span>
                   </button>
               </div>
           </div>
       </div>
   );
}

function SalesHistoryView({ sales, settings, theme, radiusClass }: any) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Rekodi ya Mauzo</h2>
            <div className={`bg-white ${radiusClass} border border-slate-200 overflow-hidden shadow-sm`}>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-[10px] font-black uppercase text-slate-400">ID</th>
                                <th className="p-4 text-[10px] font-black uppercase text-slate-400">Mteja</th>
                                <th className="p-4 text-[10px] font-black uppercase text-slate-400">Tarehe</th>
                                <th className="p-4 text-[10px] font-black uppercase text-slate-400">Jumla</th>
                                <th className="p-4 text-[10px] font-black uppercase text-slate-400">Malipo</th>
                                <th className="p-4 text-[10px] font-black uppercase text-slate-400">Hali</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                            {sales.map((sale: any) => (
                                <tr key={sale.id} className="hover:bg-slate-50">
                                    <td className="p-4 text-slate-400 font-mono">#{sale.id.slice(-6)}</td>
                                    <td className="p-4 font-bold text-slate-900">{sale.customerName}</td>
                                    <td className="p-4">{new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString()}</td>
                                    <td className="p-4 font-black">{settings.currency} {sale.grandTotal.toLocaleString()}</td>
                                    <td className="p-4 uppercase text-[10px] tracking-wide">{sale.paymentMethod}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${sale.status === SaleStatus.PAID ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {sale.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    )
}

function ReportsView({ sales, products, settings, theme, radiusClass }: any) {
    // Simple data prep for charts
    const data = sales.slice(0, 7).map((s:any) => ({ name: new Date(s.date).toLocaleDateString(), sales: s.grandTotal }));
    
    // Monthly Summary Logic
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlySales = sales.filter((s: Sale) => {
        const d = new Date(s.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const monthlyRevenue = monthlySales.reduce((acc, s) => acc + s.grandTotal, 0);
    const monthlyCost = monthlySales.reduce((acc, s) => {
        return acc + s.items.reduce((iAcc, item) => iAcc + (item.unitCost * item.quantity), 0);
    }, 0);
    const monthlyProfit = monthlyRevenue - monthlyCost - monthlySales.reduce((acc, s) => acc + (s.discountTotal || 0), 0);
    const monthlyUnits = monthlySales.reduce((acc, s) => acc + s.items.reduce((iAcc, item) => iAcc + item.quantity, 0), 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ripoti & Takwimu</h2>
            
            {/* Monthly Report Card */}
            <div className={`bg-slate-900 text-white p-8 ${radiusClass} shadow-xl relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-10 -translate-y-10">
                    <CalendarDays size={200} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Muhtasari wa Mwezi ({new Date().toLocaleString('default', { month: 'long' })})</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mapato Yote</p>
                            <p className="text-3xl font-black">{settings.currency} {monthlyRevenue.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Gharama za Mauzo</p>
                            <p className="text-3xl font-black text-slate-400">{settings.currency} {monthlyCost.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Faida Halisi</p>
                            <p className="text-3xl font-black text-emerald-400">{settings.currency} {monthlyProfit.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Bidhaa Zilizouzwa</p>
                            <p className="text-3xl font-black text-blue-400">{monthlyUnits}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className={`bg-white p-6 ${radiusClass} border border-slate-200 shadow-sm`}>
                     <h3 className="font-black uppercase text-xs text-slate-400 mb-6">Mwenendo wa Mauzo</h3>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme.hex} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={theme.hex} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="sales" stroke={theme.hex} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>
                 </div>
                 
                 <div className={`bg-white p-6 ${radiusClass} border border-slate-200 shadow-sm`}>
                     <h3 className="font-black uppercase text-xs text-slate-400 mb-6">Mgawanyiko wa Bidhaa</h3>
                     <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={[
                                        { name: 'Pikipiki', value: products.filter((p:Product) => p.category === 'Pikipiki').length },
                                        { name: 'Vipuri', value: products.filter((p:Product) => p.category === 'Vipuri').length },
                                        { name: 'Vifaa', value: products.filter((p:Product) => p.category === 'Vifaa vya Ziada').length },
                                    ]} 
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                                >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#10b981" />
                                    <Cell fill="#f43f5e" />
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                 </div>
            </div>
        </div>
    );
}

function SettingsView({ settings, setSettings, theme, radiusClass }: any) {
    const handleChange = (key: string, value: any) => setSettings((prev: any) => ({ ...prev, [key]: value }));

    return (
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Mipangilio</h2>
            
            <div className={`bg-white p-8 ${radiusClass} border border-slate-200 shadow-sm space-y-8`}>
                <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Jina la Duka</label>
                        <input value={settings.shopName} onChange={e => handleChange('shopName', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-blue-500" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Sarafu</label>
                        <input value={settings.currency} onChange={e => handleChange('currency', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-blue-500" />
                     </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400">Rangi ya Mandhari</label>
                    <div className="flex space-x-3">
                        {Object.keys(THEME_COLORS).map(color => (
                            <button 
                                key={color} 
                                onClick={() => handleChange('themeColor', color)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${THEME_COLORS[color].bg} ${settings.themeColor === color ? 'ring-4 ring-offset-2 ring-slate-200 scale-110' : 'opacity-60 hover:opacity-100'}`}
                            >
                                {settings.themeColor === color && <Check className="text-white" size={16} />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                        <p className="font-bold text-sm text-slate-900">AI Business Insights</p>
                        <p className="text-[10px] text-slate-500">Ruhusu Gemini AI kuchambua biashara yako.</p>
                    </div>
                    <button 
                        onClick={() => handleChange('enableAiInsights', !settings.enableAiInsights)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${settings.enableAiInsights ? theme.bg : 'bg-slate-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.enableAiInsights ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Low Stock Alert</label>
                        <input type="number" value={settings.lowStockAlertLevel} onChange={e => handleChange('lowStockAlertLevel', parseInt(e.target.value))} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
