
import React, { useState, useRef } from 'react';
import { generateFixImage } from './services/geminiService';
import { GenerationParams, GeneratedImage } from './types';
import LoadingOverlay from './components/LoadingOverlay';

const COLOR_PRESETS = [
  { name: 'Purple', value: 'vibrant purple' },
  { name: 'White', value: 'crisp white' },
  { name: 'Gold', value: 'elegant gold' },
  { name: 'Black', value: 'solid black' },
  { name: 'Blue', value: 'royal blue' },
  { name: 'Red', value: 'fiery red' },
  { name: 'Green', value: 'emerald green' },
  { name: 'Orange', value: 'vivid orange' },
  { name: 'Pink', value: 'hot pink' },
  { name: 'Silver', value: 'polished silver' },
];

const POSITION_OPTIONS = [
  { name: 'Top Center', value: 'top center' },
  { name: 'Middle Center', value: 'center' },
  { name: 'Bottom Center', value: 'bottom center' },
  { name: 'Top Left', value: 'top left' },
  { name: 'Top Right', value: 'top right' },
];

const STYLE_OPTIONS = [
  { name: 'Modern Sans', value: 'modern sans-serif minimalist' },
  { name: 'Elegant Serif', value: 'sophisticated elegant serif' },
  { name: 'Neon Glow', value: 'glowing futuristic neon' },
  { name: '3D Bold', value: 'heavy bold 3D isometric' },
  { name: 'Vintage', value: 'classic vintage retro' },
  { name: 'Cursive', value: 'luxurious handwritten script' },
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  
  // Form State
  const [logo, setLogo] = useState<string | null>(null);
  const [logoMimeType, setLogoMimeType] = useState<string | null>(null);
  const [mainText, setMainText] = useState('Alles is fixbaar');
  const [subText, setSubText] = useState('DM FIX');
  const [mainTextColor, setMainTextColor] = useState('vibrant purple');
  const [subTextColor, setSubTextColor] = useState('vibrant purple');
  const [textPosition, setTextPosition] = useState('center');
  const [textStyle, setTextStyle] = useState('modern sans-serif minimalist');
  const [bgPrompt, setBgPrompt] = useState('a professional luxury restaurant with many people eating and drinking, cinematic lighting');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const supportedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!supportedTypes.includes(file.type)) {
        setError(`Format ${file.type} is not supported. Please use PNG, JPEG or WEBP.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setError(null);
      setLogoMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: GenerationParams = {
        logo: logo || undefined,
        logoMimeType: logoMimeType || undefined,
        backgroundPrompt: bgPrompt,
        mainText: mainText,
        subText: subText,
        mainTextColor: mainTextColor,
        subTextColor: subTextColor,
        textPosition: textPosition,
        textStyle: textStyle
      };
      
      const imageUrl = await generateFixImage(params);
      setGeneratedImage({
        url: imageUrl,
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage.url;
    link.download = `fix-it-${generatedImage.timestamp}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 pb-20">
      {loading && <LoadingOverlay />}

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
            <i className="fa-solid fa-wand-sparkles text-white"></i>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">FixIt <span className="text-purple-600">Pro</span></h1>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-purple-200 active:scale-95 flex items-center gap-2"
        >
          <i className="fa-solid fa-rocket"></i>
          Generate Visual
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Editor */}
        <div className="lg:col-span-5 space-y-6">
          {/* Background Prompt Section */}
          <section className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-mountain-sun text-purple-600"></i>
              Image Background
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Describe the scene</label>
              <textarea 
                value={bgPrompt}
                onChange={(e) => setBgPrompt(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-slate-50 text-sm"
                placeholder="e.g., A futuristic workspace with neon lights..."
              />
              <p className="mt-2 text-[10px] text-slate-400 italic leading-tight">
                Be specific about environment, lighting, and mood for better AI results.
              </p>
            </div>
          </section>

          {/* Text Content & Style */}
          <section className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <i className="fa-solid fa-font text-purple-600"></i>
              Typography
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Header</label>
                  <input 
                    type="text"
                    value={mainText}
                    onChange={(e) => setMainText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sub Header</label>
                  <input 
                    type="text"
                    value={subText}
                    onChange={(e) => setSubText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-slate-50"
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Text Style */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Typography Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {STYLE_OPTIONS.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setTextStyle(style.value)}
                      className={`px-2 py-2 text-[11px] font-medium rounded-lg border transition-all truncate ${textStyle === style.value ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-purple-300'}`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Position */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Text Position</label>
                <div className="grid grid-cols-2 gap-2">
                  {POSITION_OPTIONS.map((pos) => (
                    <button
                      key={pos.value}
                      onClick={() => setTextPosition(pos.value)}
                      className={`px-3 py-2 text-xs rounded-lg border transition-all ${textPosition === pos.value ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'}`}
                    >
                      {pos.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Main Color */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Header Color</label>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setMainTextColor(color.value)}
                        className={`w-6 h-6 rounded-md border transition-all ${mainTextColor === color.value ? 'ring-2 ring-purple-500 ring-offset-2 scale-110' : 'border-slate-200'}`}
                        style={{ backgroundColor: color.value.includes(' ') ? color.value.split(' ').pop() : color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                {/* Sub Color */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sub Color</label>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSubTextColor(color.value)}
                        className={`w-6 h-6 rounded-md border transition-all ${subTextColor === color.value ? 'ring-2 ring-purple-500 ring-offset-2 scale-110' : 'border-slate-200'}`}
                        style={{ backgroundColor: color.value.includes(' ') ? color.value.split(' ').pop() : color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Logo Section */}
          <section className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between gap-4 ${logo ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${logo ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                  {logo ? <img src={logo} className="w-full h-full object-contain p-1" /> : <i className="fa-solid fa-upload"></i>}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{logo ? 'Logo Attached' : 'Attach Branding'}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-medium">PNG, JPG or WEBP</p>
                </div>
              </div>
              {logo && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setLogo(null); }}
                  className="bg-slate-200 hover:bg-red-100 hover:text-red-600 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <i className="fa-solid fa-trash-can text-sm"></i>
                </button>
              )}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg, image/webp"
              />
            </div>
          </section>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-slate-200 border border-slate-100 flex-grow flex flex-col overflow-hidden sticky top-24 min-h-[600px]">
            <div className="flex justify-between items-center mb-4 px-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-display text-slate-400"></i>
                Visual Output
              </h2>
              {generatedImage && (
                <div className="flex items-center gap-2">
                   <button 
                    onClick={downloadImage}
                    className="text-white font-bold text-sm flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl transition-all hover:bg-black active:scale-95 shadow-md shadow-slate-200"
                  >
                    <i className="fa-solid fa-download"></i>
                    Export PNG
                  </button>
                </div>
              )}
            </div>

            <div className="relative flex-grow rounded-[1.5rem] bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center group">
              {generatedImage ? (
                <img 
                  src={generatedImage.url} 
                  alt="Generated" 
                  className="w-full h-full object-cover animate-fade-in"
                />
              ) : (
                <div className="text-center p-12 max-w-sm">
                  <div className="w-24 h-24 bg-slate-200/50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                    <i className="fa-solid fa-wand-magic-sparkles text-5xl"></i>
                  </div>
                  <h3 className="text-2xl font-black text-slate-700 mb-4 tracking-tight uppercase">Ready for Ignition</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    Describe your background, choose your typography style, and hit generate to create a professional asset.
                  </p>
                  <div className="flex justify-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-purple-200 animate-bounce delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-300"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-x-0 bottom-0 m-6 p-4 bg-white/95 backdrop-blur-lg border border-red-100 text-red-600 rounded-2xl flex items-start gap-3 shadow-2xl z-10 border-l-4 border-l-red-500 animate-slide-up">
                  <i className="fa-solid fa-circle-exclamation mt-1 text-xl"></i>
                  <div>
                    <p className="font-bold text-sm">Generation Encountered an Issue</p>
                    <p className="text-xs opacity-80 mt-1">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="ml-auto text-slate-400 hover:text-slate-600 transition-colors p-1">
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-xs font-medium uppercase tracking-widest">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-wrench text-white text-xs"></i>
            </div>
            <span className="font-black text-slate-900">FixIt Visuals v2.0</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-purple-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-purple-600 transition-colors">API Keys</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Support</a>
          </div>
          <div className="flex gap-4">
            <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              <i className="fa-brands fa-x-twitter"></i>
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              <i className="fa-brands fa-linkedin-in"></i>
            </button>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
