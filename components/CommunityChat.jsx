import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Send, Image, Trash2, Hash, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RoleBadge from '@/components/RoleBadge';
import { hasPermission } from '@/lib/roles';

const CHANNELS = ['general', 'games', 'math', 'science', 'suggestions', 'staff'];

export default function CommunityChat({ userProfile, customRoles = [] }) {
  const [channel, setChannel] = useState('general');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { msg, x, y }
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const queryClient = useQueryClient();

  const canChat = userProfile && !userProfile.is_banned;
  const canUploadImages = hasPermission(userProfile?.roles || ['Member'], 'upload_images');
  const canDeleteMessages = hasPermission(userProfile?.roles || [], 'delete_messages');
  const canTimeout = hasPermission(userProfile?.roles || [], 'timeout');
  const canWarn = hasPermission(userProfile?.roles || [], 'warn');
  const isStaff = hasPermission(userProfile?.roles || [], 'staff_chat');

  const visibleChannels = CHANNELS.filter(c => c !== 'staff' || isStaff);

  const { data: messages = [] } = useQuery({
    queryKey: ['chat', channel],
    queryFn: () => base44.entities.ChatMessage.filter({ channel, is_deleted: false }, 'created_date', 100),
    refetchInterval: 3000,
  });

  // Cache of user_email -> avatar_url for showing profile pics
  const { data: allProfiles = [] } = useQuery({
    queryKey: ['all-profiles-chat'],
    queryFn: () => base44.entities.UserProfile.list(),
    refetchInterval: 30000,
  });
  const profileMap = useMemo(() => {
    const m = {};
    for (const p of allProfiles) m[p.user_email] = p;
    return m;
  }, [allProfiles]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: (data) => base44.entities.ChatMessage.create(data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['chat', channel] });
      // Increment message count and check for Chatter Bug badge
      if (userProfile?.id) {
        const newCount = (userProfile.message_count || 0) + 1;
        const updates = { message_count: newCount };
        if (newCount >= 100 && !(userProfile.badges || []).includes('chatter_bug')) {
          updates.badges = [...(userProfile.badges || []), 'chatter_bug'];
        }
        await base44.entities.UserProfile.update(userProfile.id, updates);
        queryClient.invalidateQueries({ queryKey: ['myprofile'] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ChatMessage.update(id, { is_deleted: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chat', channel] }),
  });

  const timeoutMutation = useMutation({
    mutationFn: ({ profileId, until }) => base44.entities.UserProfile.update(profileId, { timeout_until: until }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['exec-profiles'] }),
  });

  const warnMutation = useMutation({
    mutationFn: async ({ targetEmail, reason }) => {
      const profiles = await base44.entities.UserProfile.filter({ user_email: targetEmail });
      const p = profiles[0];
      if (!p) return;
      const newWarnings = [...(p.warnings || []), reason];
      let extra = {};
      if (newWarnings.length >= 3 && !p.is_banned) {
        extra = { is_banned: true, ban_expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), ban_reason: 'Auto-ban: 3 warnings reached' };
      }
      return base44.entities.UserProfile.update(p.id, { warnings: newWarnings, ...extra });
    },
  });

  const sendMessage = () => {
    if (!message.trim() || !userProfile) return;
    const now = new Date();
    if (userProfile.timeout_until && new Date(userProfile.timeout_until) > now) {
      const mins = Math.ceil((new Date(userProfile.timeout_until) - now) / 60000);
      alert(`You are timed out for ${mins} more minute(s).`);
      return;
    }
    sendMutation.mutate({
      username: userProfile.username || userProfile.user_email,
      user_email: userProfile.user_email,
      message: message.trim(),
      channel,
      roles: userProfile.roles || ['Member'],
    });
    setMessage('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    sendMutation.mutate({
      username: userProfile.username || userProfile.user_email,
      user_email: userProfile.user_email,
      message: '📷 Image',
      image_url: file_url,
      channel,
      roles: userProfile.roles || ['Member'],
    });
    setUploading(false);
  };

  const handleRightClick = (e, msg) => {
    if (!canDeleteMessages && !canTimeout && !canWarn) return;
    e.preventDefault();
    setContextMenu({ msg, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleTimeoutFromChat = async (minutes) => {
    if (!contextMenu) return;
    const profiles = await base44.entities.UserProfile.filter({ user_email: contextMenu.msg.user_email });
    const p = profiles[0];
    if (p) {
      const until = new Date(Date.now() + minutes * 60 * 1000).toISOString();
      timeoutMutation.mutate({ profileId: p.id, until });
    }
    closeContextMenu();
  };

  const handleWarnFromChat = () => {
    if (!contextMenu) return;
    const reason = window.prompt(`Warn ${contextMenu.msg.username}? Reason:`);
    if (reason) {
      warnMutation.mutate({ targetEmail: contextMenu.msg.user_email, reason });
    }
    closeContextMenu();
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="flex h-[75vh] bg-slate-900 rounded-2xl overflow-hidden border border-purple-500/20 relative" onClick={closeContextMenu}>
      {/* Sidebar */}
      <div className="w-44 bg-slate-800/80 border-r border-slate-700 flex flex-col">
        <div className="p-3 border-b border-slate-700">
          <h3 className="text-white font-bold text-sm">NexusBanan</h3>
          <p className="text-slate-500 text-xs">Community Chat</p>
        </div>
        <div className="flex-1 p-2 space-y-0.5">
          {visibleChannels.map(ch => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors text-left ${
                channel === ch ? 'bg-purple-600/30 text-purple-300' : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Hash className="w-3.5 h-3.5 flex-shrink-0" />
              {ch}
              {ch === 'staff' && <span className="ml-auto text-yellow-400 text-xs">🔒</span>}
            </button>
          ))}
        </div>
        {userProfile && (
          <div className="p-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              {userProfile.avatar_url ? (
                <img src={userProfile.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                  {(userProfile.username || '?')[0].toUpperCase()}
                </div>
              )}
              <p className="text-white text-xs font-bold truncate">{userProfile.username || 'You'}</p>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {(userProfile.roles || ['Member']).slice(0, 2).map(r => (
                <RoleBadge key={r} role={r} customRoles={customRoles} small />
              ))}
            </div>
            {userProfile.message_count > 0 && (
              <p className="text-slate-500 text-xs mt-1">💬 {userProfile.message_count} msgs</p>
            )}
          </div>
        )}
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
          <Hash className="w-4 h-4 text-slate-400" />
          <span className="text-white font-bold">{channel}</span>
          {channel === 'staff' && <span className="text-xs text-yellow-400 ml-1">Staff Only</span>}
          {(canTimeout || canWarn) && (
            <span className="ml-auto text-xs text-amber-400/60">Right-click messages to moderate</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              No messages yet. Be the first to say something in #{channel}!
            </div>
          )}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 group"
              onContextMenu={(e) => handleRightClick(e, msg)}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 border-2 border-slate-700">
                {profileMap[msg.user_email]?.avatar_url ? (
                  <img src={profileMap[msg.user_email].avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  (msg.username || '?')[0].toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-bold text-sm">{msg.username}</span>
                  {(msg.roles || ['Member']).map(r => (
                    <RoleBadge key={r} role={r} customRoles={customRoles} small />
                  ))}
                  <span className="text-slate-500 text-xs">{getTimeAgo(msg.created_date)}</span>
                </div>
                {msg.image_url ? (
                  <img src={msg.image_url} alt="shared" className="mt-1 max-w-xs rounded-lg max-h-48 object-cover" />
                ) : (
                  <p className="text-slate-200 text-sm mt-0.5 break-words">{msg.message}</p>
                )}
              </div>
              {canDeleteMessages && (
                <button
                  onClick={() => deleteMutation.mutate(msg.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {!userProfile ? (
          <div className="p-4 border-t border-slate-700 text-slate-400 text-sm text-center">
            Set up your profile in the Roles tab to chat.
          </div>
        ) : userProfile.is_banned ? (
          <div className="p-4 border-t border-slate-700 text-red-400 text-sm text-center font-bold">
            🚫 You are banned{userProfile.ban_reason ? `: ${userProfile.ban_reason}` : ''}.
          </div>
        ) : (
          <div className="p-3 border-t border-slate-700 flex items-center gap-2">
            {canUploadImages && (
              <>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="text-slate-400 hover:text-purple-400 transition-colors"
                >
                  <Image className="w-5 h-5" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </>
            )}
            <Input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={`Message #${channel}...`}
              className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Button
              onClick={sendMessage}
              disabled={!message.trim() || sendMutation.isPending}
              size="icon"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Right-click Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl py-1 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-3 py-1.5 border-b border-slate-700">
              <p className="text-xs text-slate-400 font-bold">{contextMenu.msg.username}</p>
            </div>
            {canDeleteMessages && (
              <button
                onClick={() => { deleteMutation.mutate(contextMenu.msg.id); closeContextMenu(); }}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Message
              </button>
            )}
            {canWarn && (
              <button onClick={handleWarnFromChat} className="w-full text-left px-3 py-2 text-sm text-orange-400 hover:bg-orange-500/10 flex items-center gap-2">
                ⚠️ Warn User
              </button>
            )}
            {canTimeout && (
              <>
                <button onClick={() => handleTimeoutFromChat(5)} className="w-full text-left px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/10 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Timeout 5m
                </button>
                <button onClick={() => handleTimeoutFromChat(30)} className="w-full text-left px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/10 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Timeout 30m
                </button>
                <button onClick={() => handleTimeoutFromChat(60)} className="w-full text-left px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/10 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Timeout 1h
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}