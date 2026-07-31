import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function SiteViewer() {
  const [site, setSite] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const slug = path.replace('/site/', '').replace(/\//g, '');
    if (!slug) { setNotFound(true); return; }

    base44.entities.PublishedSite.filter({ slug }, '-created_date', 1).then(results => {
      if (results[0]) setSite(results[0]);
      else setNotFound(true);
    });
  }, []);

  if (notFound) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center">
        <div>
          <div className="text-6xl mb-4">🌐</div>
          <h1 className="text-3xl font-black mb-2">Site Not Found</h1>
          <p className="text-slate-400 mb-4">This site doesn't exist or was removed.</p>
          <a href="/" className="px-6 py-2 bg-cyan-600 rounded-xl text-white font-semibold hover:bg-cyan-700">Back to NexusBanan</a>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-2 flex items-center gap-3 text-sm">
        <a href="/" className="text-yellow-400 font-black text-xs">🍌 NexusBanan</a>
        <span className="text-slate-600">/</span>
        <span className="text-slate-300 font-semibold">{site.title}</span>
        {site.creator_name && <span className="text-slate-500 text-xs ml-auto">by {site.creator_name}</span>}
      </div>
      <iframe
        srcDoc={site.html_content}
        className="flex-1 w-full border-0"
        title={site.title}
        sandbox="allow-scripts allow-forms allow-popups"
      />
    </div>
  );
}