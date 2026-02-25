import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Volume2, VolumeX, Play, X, Square } from "lucide-react";
import { SoundType } from "@/hooks/useAudio";

interface SettingsPanelProps {
  intervalEnabled: boolean;
  setIntervalEnabled: (v: boolean) => void;
  intervalSeconds: number;
  setIntervalSeconds: (v: number) => void;

  greenRedEnabled: boolean;
  setGreenRedEnabled: (v: boolean) => void;
  greenDuration: number;
  setGreenDuration: (v: number) => void;
  redDuration: number;
  setRedDuration: (v: number) => void;

  greenRedSoundEnabled: boolean;
  setGreenRedSoundEnabled: (v: boolean) => void;
  greenSound: SoundType;
  setGreenSound: (v: SoundType) => void;
  redSound: SoundType;
  setRedSound: (v: SoundType) => void;

  selectedSound: SoundType;
  setSelectedSound: (v: SoundType) => void;
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  setIsMuted: (v: boolean) => void;
  availableSounds: SoundType[];
  previewSound: (s: SoundType) => void;
  stopAllSounds: () => void;
  isPlaying: boolean;
  resetSettings: () => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  intervalEnabled,
  setIntervalEnabled,
  intervalSeconds,
  setIntervalSeconds,
  greenRedEnabled,
  setGreenRedEnabled,
  greenDuration,
  setGreenDuration,
  redDuration,
  setRedDuration,
  greenRedSoundEnabled,
  setGreenRedSoundEnabled,
  greenSound,
  setGreenSound,
  redSound,
  setRedSound,
  selectedSound,
  setSelectedSound,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  availableSounds,
  previewSound,
  stopAllSounds,
  isPlaying,
  resetSettings,
  onClose,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-ocean/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-8 bg-ocean-blue border-neon-cyan/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-neon-cyan tracking-tight">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Interval Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Interval Alert</h3>
            <Switch
              checked={intervalEnabled}
              onChange={(e) => setIntervalEnabled(e.target.checked)}
            />
          </div>
          
          <div className={`space-y-4 transition-opacity ${intervalEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="flex items-center gap-4">
                <Slider
                    value={intervalSeconds}
                    min={1}
                    max={300}
                    onChange={(e) => setIntervalSeconds(parseInt(e.target.value))}
                    className="flex-1"
                />
                <input 
                    type="number" 
                    value={intervalSeconds}
                    onChange={(e) => setIntervalSeconds(Math.max(1, Math.min(300, parseInt(e.target.value) || 0)))}
                    className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono text-neon-cyan focus:outline-none focus:border-neon-cyan"
                />
            </div>
            <p className="text-xs text-slate-500">
              Plays a sound every {intervalSeconds} seconds.
            </p>
          </div>
        </div>

        {/* Green/Red Mode Settings */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Green / Red Mode</h3>
            <Switch
              checked={greenRedEnabled}
              onChange={(e) => setGreenRedEnabled(e.target.checked)}
            />
          </div>

          <div className={`space-y-4 transition-opacity ${greenRedEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="space-y-2">
                <label className="text-sm text-slate-400">Green Duration (s)</label>
                <div className="flex items-center gap-4">
                    <Slider
                        value={greenDuration}
                        min={1}
                        max={60}
                        onChange={(e) => setGreenDuration(parseInt(e.target.value))}
                        className="flex-1 accent-teal-glow"
                    />
                    <input 
                        type="number" 
                        value={greenDuration}
                        onChange={(e) => setGreenDuration(Math.max(1, Math.min(300, parseInt(e.target.value) || 0)))}
                        className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono text-teal-glow focus:outline-none focus:border-teal-glow"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm text-slate-400">Red Duration (s)</label>
                <div className="flex items-center gap-4">
                    <Slider
                        value={redDuration}
                        min={1}
                        max={60}
                        onChange={(e) => setRedDuration(parseInt(e.target.value))}
                        className="flex-1 accent-alert-red"
                    />
                    <input 
                        type="number" 
                        value={redDuration}
                        onChange={(e) => setRedDuration(Math.max(1, Math.min(300, parseInt(e.target.value) || 0)))}
                        className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono text-alert-red focus:outline-none focus:border-alert-red"
                    />
                </div>
            </div>
          </div>
        </div>

        {/* Sound Settings */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Sound Effects</h3>
            <div className="flex gap-2">
                <Button
                variant={isPlaying ? "danger" : "primary"}
                size="icon"
                onClick={() => isPlaying ? stopAllSounds() : previewSound(selectedSound)}
                title={isPlaying ? "Stop Sound" : "Test Sound"}
                className={isPlaying ? "bg-alert-red/20 text-alert-red hover:bg-alert-red hover:text-white border border-alert-red/50" : "bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-black border border-neon-cyan/50"}
                >
                {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                </Button>
                <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Unmute" : "Mute"}
                >
                {isMuted ? <VolumeX className="text-alert-red" /> : <Volume2 className="text-neon-cyan" />}
                </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm text-slate-400">Volume</label>
                <div className="flex items-center gap-4">
                    <Slider
                        value={volume}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="flex-1"
                    />
                    <input 
                        type="number" 
                        value={Math.round(volume * 100)}
                        min={0}
                        max={100}
                        onChange={(e) => setVolume(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) / 100)}
                        className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono text-white focus:outline-none focus:border-neon-cyan"
                    />
                </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-slate-400 block mb-2">Interval Sound</label>
              <div className="flex gap-2 flex-wrap">
                {availableSounds.map((sound) => (
                  <Button
                    key={sound}
                    variant={selectedSound === sound ? "primary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedSound(sound);
                      previewSound(sound);
                    }}
                    className="capitalize text-xs"
                  >
                    {sound}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Transition Sounds</h4>
                    <Switch
                        checked={greenRedSoundEnabled}
                        onChange={(e) => setGreenRedSoundEnabled(e.target.checked)}
                    />
                </div>
                <div className={`grid grid-cols-2 gap-4 transition-opacity ${greenRedSoundEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <div className="space-y-2">
                        <label className="text-xs text-teal-glow">Green Sound</label>
                        <select 
                            value={greenSound}
                            onChange={(e) => {
                                const s = e.target.value as SoundType;
                                setGreenSound(s);
                                previewSound(s);
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-teal-glow"
                        >
                            {availableSounds.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-alert-red">Red Sound</label>
                        <select 
                            value={redSound}
                            onChange={(e) => {
                                const s = e.target.value as SoundType;
                                setRedSound(s);
                                previewSound(s);
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-alert-red"
                        >
                            {availableSounds.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Reset Defaults */}
        <div className="pt-6 border-t border-white/10">
            {!showResetConfirm ? (
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowResetConfirm(true)} 
                    className="w-full text-xs h-10 border-white/10 hover:bg-white/5 hover:text-white"
                >
                    Reset to Defaults
                </Button>
            ) : (
                <div className="flex gap-2">
                    <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => {
                            resetSettings();
                            setShowResetConfirm(false);
                        }} 
                        className="flex-1 text-xs h-10"
                    >
                        Confirm Reset
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowResetConfirm(false)} 
                        className="flex-1 text-xs h-10"
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};
