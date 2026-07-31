import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Github, FileArchive, FileCode, Check, Copy, ArrowRight, Terminal, FolderGit2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const README = `# NexusBanan.net

Educational gaming hub built on Base44 (React + Vite + Tailwind CSS).

## Local Development

\`\`\`bash
git clone <your-repo-url>
cd nexusbanan
npm install
\`\`\`

Create a \`.env.local\` file (see \`.env.example\`):

\`\`\`
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url
\`\`\`

Then run:

\`\`\`bash
npm run dev
\`\`\`

## Getting the Source

The full project source is exported from the Base44 editor:

1. Click **Code** in the top bar of the app editor
2. Click the **Export project as ZIP** icon (download) at the top right
3. Unzip, then push to GitHub

Alternatively, connect Base44 directly to GitHub from the **Dashboard** for 2-way sync.

## Stack

- React + Vite
- Tailwind CSS + shadcn/ui
- Base44 BaaS (auth, database, integrations, hosting)
- Framer Motion, Recharts, React Leaflet
`;

const ENV_EXAMPLE = `# Base44 app credentials — get these from your Base44 dashboard
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url
`;

const GITIGNORE = `# Dependencies
node_modules/

# Build output
dist/
build/

# Environment
.env.local
.env.*.local

# Editor
.vscode/
.idea/
*.swp
.DS_Store

# Logs
*.log
npm-debug.log*
`;

export default function GitExport() {
  const [copied, setCopied] = useState('');

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-3 mb-3">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
            <Github className="w-7 h-7 text-white" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-black text-white">Get Website Files for Git</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">Download your project source and upload it to GitHub. The full code export happens in the Base44 editor — grab the starter files here.</p>
      </div>

      {/* Method 1: ZIP Export */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/60 border border-cyan-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <FileArchive className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold">Option 1 · Export as ZIP</h3>
            <p className="text-xs text-slate-400">Download everything, then push to GitHub manually</p>
          </div>
        </div>
        <ol className="space-y-2 text-sm text-slate-300 ml-2">
          <li className="flex gap-2"><span className="text-cyan-400 font-bold">1.</span> Open the app editor and click <span className="text-white font-semibold">Code</span> in the top bar</li>
          <li className="flex gap-2"><span className="text-cyan-400 font-bold">2.</span> Click the <span className="text-white font-semibold">Export project as ZIP</span> icon (download) at the top right of the code view</li>
          <li className="flex gap-2"><span className="text-cyan-400 font-bold">3.</span> Unzip the file on your computer</li>
          <li className="flex gap-2"><span className="text-cyan-400 font-bold">4.</span> Run the git commands below to push it to GitHub</li>
        </ol>
      </motion.div>

      {/* Method 2: GitHub Sync */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-slate-800/60 border border-purple-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Github className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold">Option 2 · GitHub 2-Way Sync</h3>
            <p className="text-xs text-slate-400">Connect Base44 directly to a GitHub repo — changes sync automatically</p>
          </div>
        </div>
        <ol className="space-y-2 text-sm text-slate-300 ml-2">
          <li className="flex gap-2"><span className="text-purple-400 font-bold">1.</span> Open the <span className="text-white font-semibold">Dashboard</span> in the app editor</li>
          <li className="flex gap-2"><span className="text-purple-400 font-bold">2.</span> Click the <span className="text-white font-semibold">GitHub</span> icon at the top right → <span className="text-white font-semibold">Connect to GitHub</span></li>
          <li className="flex gap-2"><span className="text-purple-400 font-bold">3.</span> Authorize Base44 and choose your account/organization</li>
          <li className="flex gap-2"><span className="text-purple-400 font-bold">4.</span> Install and create a new repository for your app</li>
        </ol>
        <p className="text-xs text-purple-300/70 mt-3 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Changes merged to <code className="bg-slate-900 px-1 rounded">main</code> sync to your Base44 app automatically.</p>
      </motion.div>

      {/* Starter files */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-wide"><FileCode className="w-4 h-4" /> Starter Files for Your Repo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={() => downloadText('README.md', README)} className="group bg-slate-800/60 border border-slate-700 hover:border-cyan-500/50 rounded-xl p-4 text-left transition-all">
            <Download className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-semibold text-sm">README.md</p>
            <p className="text-xs text-slate-500">Project overview + setup steps</p>
          </button>
          <button onClick={() => downloadText('.env.example', ENV_EXAMPLE)} className="group bg-slate-800/60 border border-slate-700 hover:border-amber-500/50 rounded-xl p-4 text-left transition-all">
            <Download className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-semibold text-sm">.env.example</p>
            <p className="text-xs text-slate-500">Environment variable template</p>
          </button>
          <button onClick={() => downloadText('.gitignore', GITIGNORE)} className="group bg-slate-800/60 border border-slate-700 hover:border-green-500/50 rounded-xl p-4 text-left transition-all">
            <Download className="w-5 h-5 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-semibold text-sm">.gitignore</p>
            <p className="text-xs text-slate-500">Ignores node_modules, env, build</p>
          </button>
        </div>
      </div>

      {/* Git commands */}
      <div className="bg-slate-950/80 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-700">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Terminal className="w-3.5 h-3.5" /> Push to GitHub</span>
          <button onClick={() => copy(`git init\ngit add .\ngit commit -m "Initial commit from NexusBanan"\ngit branch -M main\ngit remote add origin https://github.com/your-username/your-repo.git\ngit push -u origin main`, 'git')} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            {copied === 'git' ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
        </div>
        <pre className="p-4 text-xs text-green-400 overflow-x-auto leading-relaxed"><code>{`git init
git add .
git commit -m "Initial commit from NexusBanan"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main`}</code></pre>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
        <FolderGit2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/90">Both export methods require a <span className="font-bold">Builder plan or higher</span>. If you hit a plan wall, contact Base44 support. The full source ZIP is only available from the editor's Code view — it can't be generated from within the running app.</p>
      </div>
    </div>
  );
}