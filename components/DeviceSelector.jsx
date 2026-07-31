import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Tablet, Smartphone, Shield, ShieldOff } from 'lucide-react';

export default function DeviceSelector({ onSelect }) {
  const [step, setStep] = useState('device'); // 'device' | 'goguardian'
  const [selectedDevice, setSelectedDevice] = useState(null);

  const devices = [
    { id: 'windows', name: 'Windows/Mac', icon: Monitor, color: 'from-blue-600 to-cyan-600', description: 'Desktop or Laptop' },
    { id: 'chromebook', name: 'Chromebook', icon: Tablet, color: 'from-green-600 to-emerald-600', description: 'Chrome OS Device' },
    { id: 'phone', name: 'Phone/Tablet', icon: Smartphone, color: 'from-purple-600 to-pink-600', description: 'Mobile Device' },
  ];

  const handleDeviceSelect = (deviceId) => {
    setSelectedDevice(deviceId);
    localStorage.setItem('deviceType', deviceId);
    setStep('goguardian');
  };

  const handleGoGuardian = (hasGG) => {
    localStorage.setItem('hasGoGuardian', String(hasGG));
    onSelect(selectedDevice, hasGG);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center p-4"
    >
      <AnimatePresence mode="wait">
        {step === 'device' && (
          <motion.div
            key="device"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="max-w-4xl w-full"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 mb-4">
                Welcome to NexusBanan!
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-2">Select your device for the best experience</p>
              <p className="text-sm text-slate-500">Step 1 of 2</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {devices.map((device, i) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeviceSelect(device.id)}
                  className={`p-8 rounded-2xl bg-gradient-to-br ${device.color} cursor-pointer shadow-2xl border-2 border-white/20`}
                >
                  <device.icon className="w-16 h-16 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white text-center mb-2">{device.name}</h3>
                  <p className="text-white/80 text-center text-sm">{device.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'goguardian' && (
          <motion.div
            key="goguardian"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="max-w-3xl w-full"
          >
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🛡️</div>
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 mb-4">
                Are you blocked?
              </h1>
              <p className="text-lg text-slate-300 mb-2">This helps us show you games that actually work!</p>
              <p className="text-sm text-slate-500">Step 2 of 2 — Does your school block certain websites?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGoGuardian(true)}
                className="p-8 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 cursor-pointer shadow-2xl border-2 border-white/20"
              >
                <Shield className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white text-center mb-2">Yes, sites are blocked</h3>
                <p className="text-white/80 text-center text-sm">I'm on a school device with filtering. Show me only unblocked games!</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGoGuardian(false)}
                className="p-8 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-700 cursor-pointer shadow-2xl border-2 border-white/20"
              >
                <ShieldOff className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white text-center mb-2">No, I'm unblocked</h3>
                <p className="text-white/80 text-center text-sm">I'm on a personal device or unblocked. Show me all the games!</p>
              </motion.div>
            </div>

            <p className="text-center text-slate-400 text-sm mt-8">
              You can change this later by refreshing and re-selecting
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}