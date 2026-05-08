import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Download, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function SettingsView() {
  const { resetApp, exportData, importData } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fishbowl-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const success = await importData(text);
      if (success) {
        setImportStatus("Import successful! Your data has been updated.");
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus("Import failed. Invalid file format.");
        setTimeout(() => setImportStatus(null), 3000);
      }
    } catch (e) {
      setImportStatus("An error occurred during import.");
      setTimeout(() => setImportStatus(null), 3000);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading text-primary">Settings</h2>
          <p className="text-muted-foreground">Manage your application data and preferences</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card/40 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export your library to share with other devices, or import an existing backup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleExport} className="flex-1 bg-primary text-black hover:bg-primary/80">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              
              <div className="flex-1">
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImport}
                />
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </div>
            </div>
            
            {importStatus && (
              <div className={`p-3 rounded-md flex items-center text-sm ${importStatus.includes('successful') ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                {importStatus.includes('successful') ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
                {importStatus}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription className="text-foreground/80">
              This will permanently delete all local data, including custom cocktails and menus, and restore the default database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => {
                if (window.confirm("Are you sure? This cannot be undone.")) {
                  resetApp();
                  navigate('/fishbowl');
                }
              }} 
              variant="destructive"
            >
              Reset Application Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
