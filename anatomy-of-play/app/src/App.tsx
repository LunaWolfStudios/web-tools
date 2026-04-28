/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LandingScreen } from './components/LandingScreen';
import { BodyHub } from './components/BodyHub';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <div className="w-full min-h-screen relative bg-[#0A0A0F] text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: "circIn" }}
            className="absolute inset-0 z-50"
          >
            <LandingScreen onEnter={() => setHasEntered(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0"
          >
            <BodyHub />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
