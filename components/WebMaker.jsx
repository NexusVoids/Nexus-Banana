import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Code, Globe, Download, Copy, Eye, Plus, Trash2, ExternalLink, Bot, Layout, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TEMPLATES = [
  {
    name: 'Portfolio', emoji: '🎨',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>My Portfolio</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',sans-serif;background:#0a0a1a;color:#fff;}header{background:linear-gradient(135deg,#667eea,#764ba2);padding:80px 20px;text-align:center;}h1{font-size:3rem;font-weight:900;margin-bottom:10px;}p.sub{opacity:.7;font-size:1.1rem;}.section{max-width:900px;margin:60px auto;padding:0 20px;}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;}.card{background:#1a1a2e;border-radius:16px;padding:24px;border:1px solid #333;transition:transform .2s;}.card:hover{transform:translateY(-5px);border-color:#667eea;}h2{font-size:2rem;margin-bottom:20px;}.tag{display:inline-block;background:#667eea33;color:#8b9cf7;padding:4px 12px;border-radius:20px;font-size:.8rem;margin:2px;}footer{text-align:center;padding:40px;color:#555;}</style></head><body><header><h1>Your Name</h1><p class="sub">Developer · Designer · Creator</p></header><div class="section"><h2>Projects</h2><div class="grid"><div class="card"><h3>Project One</h3><p style="color:#aaa;margin:10px 0">A cool project description goes here.</p><span class="tag">HTML</span><span class="tag">CSS</span></div><div class="card"><h3>Project Two</h3><p style="color:#aaa;margin:10px 0">Another amazing project you built.</p><span class="tag">JavaScript</span><span class="tag">React</span></div></div></div><footer>Made with ❤️ using NexusBanan Web Maker</footer></body></html>`
  },
  {
    name: 'Game', emoji: '🎮',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>My Game</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#0d0d0d;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:monospace;color:#0f0;}#score{font-size:2rem;margin-bottom:20px;text-shadow:0 0 10px #0f0;}canvas{border:2px solid #0f0;box-shadow:0 0 30px #0f03;cursor:none;}p{margin-top:20px;color:#0f08;font-size:.9rem;}</style></head><body><div id="score">Score: <span id="s">0</span></div><canvas id="c" width="400" height="400"></canvas><p>Click the canvas and press keys to play!</p><script>const c=document.getElementById('c'),ctx=c.getContext('2d');let x=200,y=200,vx=3,vy=2,score=0;function loop(){ctx.fillStyle='rgba(0,0,0,.15)';ctx.fillRect(0,0,400,400);ctx.shadowBlur=20;ctx.shadowColor='#0f0';ctx.fillStyle='#0f0';ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fill();x+=vx;y+=vy;if(x<8||x>392)vx*=-1;if(y<8||y>392){vy*=-1;score++;document.getElementById('s').textContent=score;}requestAnimationFrame(loop);}loop();</script></body></html>`
  },
  {
    name: 'Blog', emoji: '📝',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>My Blog</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Georgia,serif;background:#fefefe;color:#222;}.nav{background:#222;padding:16px 40px;display:flex;align-items:center;gap:20px;}.nav h1{color:#fff;font-size:1.4rem;font-weight:900;}.nav a{color:#aaa;text-decoration:none;font-family:sans-serif;font-size:.9rem;}.hero{background:linear-gradient(135deg,#f093fb,#f5576c);padding:80px 40px;text-align:center;color:#fff;}h2.title{font-size:2.5rem;margin-bottom:10px;}p.sub{font-size:1.1rem;opacity:.85;}.posts{max-width:760px;margin:60px auto;padding:0 20px;}.post{border-bottom:1px solid #eee;padding:40px 0;}.post:last-child{border:0;}.post h3{font-size:1.5rem;margin-bottom:8px;color:#111;}.post .meta{color:#999;font-size:.85rem;font-family:sans-serif;margin-bottom:12px;}.post p{line-height:1.8;color:#555;}</style></head><body><nav class="nav"><h1>My Blog</h1><a href="#">Home</a><a href="#">About</a></nav><div class="hero"><h2 class="title">Welcome to My Blog</h2><p class="sub">Thoughts, ideas, and stories</p></div><div class="posts"><div class="post"><h3>My First Post</h3><div class="meta">April 1, 2026 · 5 min read</div><p>This is where your story begins. Edit this template to add your own content and make it yours!</p></div><div class="post"><h3>Another Post</h3><div class="meta">March 28, 2026 · 3 min read</div><p>Keep writing and sharing your thoughts with the world. The more you write, the better you get.</p></div></div></body></html>`
  },
  {
    name: 'Landing Page', emoji: '🚀',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Landing Page</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',sans-serif;background:#000;color:#fff;}.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;background:radial-gradient(ellipse at 50% 0%,#1a0533,#000 70%);}.badge{background:#ffffff15;border:1px solid #ffffff25;color:#c084fc;padding:6px 16px;border-radius:99px;font-size:.85rem;margin-bottom:24px;display:inline-block;}h1{font-size:clamp(2.5rem,6vw,5rem);font-weight:900;line-height:1.1;margin-bottom:20px;}.grad{background:linear-gradient(135deg,#c084fc,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}p{max-width:600px;color:#9ca3af;font-size:1.1rem;line-height:1.7;margin-bottom:40px;}.cta{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;}.btn{padding:14px 32px;border-radius:12px;font-weight:700;font-size:1rem;cursor:pointer;transition:transform .15s;}.btn:hover{transform:scale(1.04)}.btn-primary{background:linear-gradient(135deg,#a855f7,#3b82f6);color:#fff;border:0;}.btn-outline{background:transparent;color:#fff;border:1px solid #ffffff30;}</style></head><body><div class="hero"><span class="badge">✨ Now Available</span><h1>Build Something<br><span class="grad">Amazing Today</span></h1><p>The best platform for building, sharing, and discovering incredible web experiences. Start for free.</p><div class="cta"><button class="btn btn-primary" onclick="alert('Coming soon!')">Get Started Free</button><button class="btn btn-outline">Learn More</button></div></div></body></html>`
  },
];

export default function WebMaker({ userProfile }) {
  const [mode, setMode] = useState('home'); // home | ai | code | publish
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishTitle, setPublishTitle] = useState('');
  const [publishDesc, setPublishDesc] = useState('');
  const [publishedSlug, setPublishedSlug] = useState('');
  const [aiChat, setAiChat] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiChatLoading, setAiChatLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: mySites = [] } = useQuery({
    queryKey: ['my-sites', userProfile?.id],
    queryFn: () => base44.entities.PublishedSite.filter({ creator_id: userProfile?.id || 'guest' }, '-created_date', 20),
    enabled: true,
  });

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Create a complete, beautiful, modern single-page HTML website with inline CSS and JavaScript based on this description: "${aiPrompt}".
      Make it visually stunning with modern design, gradients, animations, and responsive layout.
      Use modern CSS variables, flexbox/grid. Include all HTML, CSS, JS in one file.
      IMPORTANT: Return ONLY the complete HTML code starting with <!DOCTYPE html>, no explanations or markdown.`,
    });
    setHtmlCode(result);
    setPreviewHtml(result);
    setAiLoading(false);
    setMode('code');
  };

  const sendAiChat = async () => {
    if (!aiInput.trim()) return;
    const msg = aiInput.trim();
    setAiInput('');
    const newChat = [...aiChat, { role: 'user', text: msg }];
    setAiChat(newChat);
    setAiChatLoading(true);
    const context = htmlCode ? `Current HTML:\n\`\`\`html\n${htmlCode.slice(0, 3000)}\n\`\`\`\n\n` : '';
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `${context}User request: "${msg}"\n\nYou are a helpful web development assistant. ${htmlCode ? 'If the user wants to modify the HTML, return the complete updated HTML code only (starting with <!DOCTYPE html>). Otherwise, give a helpful explanation.' : 'Help the user build their website. If they ask to create something, return complete HTML code starting with <!DOCTYPE html>.'}`,
    });
    const isHtml = result.trim().startsWith('<!DOCTYPE') || result.trim().startsWith('<html');
    if (isHtml) {
      setHtmlCode(result);
      setPreviewHtml(result);
      setAiChat([...newChat, { role: 'assistant', text: '✅ I updated your website! Check the preview.', isCode: true }]);
    } else {
      setAiChat([...newChat, { role: 'assistant', text: result }]);
    }
    setAiChatLoading(false);
  };

  const publishSite = async () => {
    if (!publishTitle.trim() || !htmlCode.trim()) return;
    setPublishing(true);
    const slug = publishTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).slice(2, 7);
    await base44.entities.PublishedSite.create({
      title: publishTitle,
      slug,
      html_content: htmlCode,
      creator_name: userProfile?.username || 'Anonymous',
      creator_id: userProfile?.id || 'guest',
      description: publishDesc,
      is_public: true,
    });
    setPublishedSlug(slug);
    setPublishing(false);
    queryClient.invalidateQueries({ queryKey: ['my-sites'] });
  };

  const copyUrl = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/site/${slug}`);
  };

  const downloadHTML = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${publishTitle || 'my-site'}.html`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Web Maker</h2>
          <p className="text-slate-400 text-sm">Build, preview, and publish your own websites</p>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'home', label: 'My Sites', icon: Layout },
          { id: 'ai', label: 'AI Builder', icon: Bot },
          { id: 'code', label: 'Code Editor', icon: Code },
          ...(htmlCode ? [{ id: 'publish', label: 'Publish', icon: Globe }] : []),
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
              mode === tab.id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* HOME - My sites + Templates */}
      {mode === 'home' && (
        <div className="space-y-6">
          {/* Templates */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Start from a template</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TEMPLATES.map(t => (
                <motion.button
                  key={t.name}
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setHtmlCode(t.html); setPreviewHtml(t.html); setMode('code'); }}
                  className="bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-cyan-500/40 rounded-2xl p-5 text-center transition-all group"
                >
                  <div className="text-4xl mb-2">{t.emoji}</div>
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs mt-1 group-hover:text-cyan-400 transition-colors">Use template →</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* My Sites */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">My Published Sites ({mySites.length})</h3>
            {mySites.length === 0 ? (
              <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-10 text-center">
                <Globe className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">No sites published yet. Build something!</p>
                <button onClick={() => setMode('ai')} className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-sm hover:opacity-90">
                  Start with AI
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {mySites.map(site => (
                  <div key={site.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold truncate">{site.title}</h4>
                      {site.description && <p className="text-slate-400 text-xs mt-0.5 truncate">{site.description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded truncate max-w-[200px]">
                          /site/{site.slug}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button onClick={() => copyUrl(site.slug)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-lg">
                        <Copy className="w-3 h-3" /> Copy URL
                      </button>
                      <button onClick={() => { setHtmlCode(site.html_content); setPreviewHtml(site.html_content); setMode('code'); }} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-lg">
                        <Code className="w-3 h-3" /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI BUILDER */}
      {mode === 'ai' && (
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-1 flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" /> AI Website Generator
            </h3>
            <p className="text-slate-400 text-sm mb-4">Describe what you want and AI will build it instantly</p>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="E.g., A dark themed portfolio for a game developer with animated neon effects, a projects section, and a contact form..."
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none mb-3"
            />
            <Button
              onClick={generateWithAI}
              disabled={aiLoading || !aiPrompt.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-6 text-base font-bold"
            >
              {aiLoading ? (
                <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  ⚡ Generating your website...
                </motion.span>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" /> Generate Website</>
              )}
            </Button>
          </div>

          {/* AI Chat assistant */}
          {htmlCode && (
            <div className="bg-slate-800/60 border border-cyan-500/20 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" /> AI Assistant
                <span className="text-xs text-slate-500 font-normal">Ask me to modify your site</span>
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                {aiChat.map((m, i) => (
                  <div key={i} className={`text-sm px-3 py-2 rounded-xl ${m.role === 'user' ? 'bg-cyan-500/10 text-cyan-300 ml-8' : 'bg-slate-700/50 text-slate-200 mr-8'}`}>
                    {m.text}
                  </div>
                ))}
                {aiChatLoading && <div className="text-xs text-slate-500 ml-2">AI is thinking...</div>}
              </div>
              <div className="flex gap-2">
                <input
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendAiChat()}
                  placeholder='E.g., "Make the header blue" or "Add a footer"'
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button onClick={sendAiChat} disabled={!aiInput.trim() || aiChatLoading} className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold text-sm hover:bg-cyan-700 disabled:opacity-40">
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CODE EDITOR */}
      {mode === 'code' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => { setPreviewHtml(htmlCode); setShowPreview(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-xl text-sm font-semibold"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button onClick={downloadHTML} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-semibold">
              <Download className="w-4 h-4" /> Download
            </button>
            <button onClick={() => navigator.clipboard.writeText(htmlCode)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-semibold">
              <Copy className="w-4 h-4" /> Copy Code
            </button>
            <button onClick={() => setMode('publish')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl text-sm font-semibold ml-auto">
              <Globe className="w-4 h-4" /> Publish Site →
            </button>
          </div>
          <textarea
            value={htmlCode}
            onChange={e => setHtmlCode(e.target.value)}
            className="w-full h-[50vh] bg-[#0d1117] border border-slate-700 rounded-2xl px-5 py-4 text-green-400 font-mono text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
            spellCheck={false}
            placeholder="<!DOCTYPE html>&#10;<html>&#10;  <!-- Write your HTML here -->&#10;</html>"
          />
        </div>
      )}

      {/* PUBLISH */}
      {mode === 'publish' && (
        <div className="max-w-lg mx-auto space-y-5">
          <div className="bg-slate-800/60 border border-purple-500/20 rounded-2xl p-6">
            <h3 className="text-white font-black text-xl mb-1">Publish Your Site</h3>
            <p className="text-slate-400 text-sm mb-5">Your site will get a unique URL you can share with anyone!</p>
            
            {publishedSlug ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <p className="text-green-400 font-bold text-lg mb-2">🎉 Site Published!</p>
                  <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-4 py-2">
                    <span className="text-cyan-400 font-mono text-sm flex-1 truncate">
                      {window.location.origin}/site/{publishedSlug}
                    </span>
                    <button onClick={() => copyUrl(publishedSlug)} className="text-slate-400 hover:text-white">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button onClick={() => { setPublishedSlug(''); setPublishTitle(''); setPublishDesc(''); }} className="w-full py-2 bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-600">
                  Publish Another Version
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Site Title *</label>
                  <Input
                    value={publishTitle}
                    onChange={e => setPublishTitle(e.target.value)}
                    placeholder="My Awesome Website"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Description (optional)</label>
                  <Input
                    value={publishDesc}
                    onChange={e => setPublishDesc(e.target.value)}
                    placeholder="A short description of your site..."
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 text-sm text-slate-400">
                  <p>Your site URL will be:</p>
                  <p className="text-cyan-400 font-mono mt-1">
                    {window.location.origin}/site/{publishTitle ? publishTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'your-site'}-xxxxx
                  </p>
                </div>
                <Button
                  onClick={publishSite}
                  disabled={publishing || !publishTitle.trim() || !htmlCode.trim()}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 py-5 text-base font-bold"
                >
                  {publishing ? 'Publishing...' : '🚀 Publish to the Web'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
              <span className="text-white font-bold text-sm">Preview</span>
              <button onClick={() => setShowPreview(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <iframe srcDoc={previewHtml} className="flex-1 w-full border-0 bg-white" title="Preview" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}