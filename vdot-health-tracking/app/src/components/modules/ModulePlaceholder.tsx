import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';

export default function ModulePlaceholder({ moduleName, moduleId }: { moduleName: string, moduleId: string }) {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{moduleName}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view records for {moduleName.toLowerCase()}.
          </p>
        </div>
        <Button>Upload Records</Button>
      </div>

      <Card className="flex-1 rounded-xl border border-border bg-card shadow-sm flex items-center justify-center">
        <CardContent className="text-center p-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl opacity-50">🚧</span>
          </div>
          <h3 className="text-lg font-medium">Under Construction</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            The {moduleName} module is currently in development. Check back later for updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
