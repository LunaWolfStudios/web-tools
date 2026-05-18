import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, FileText, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { mockEmployees } from '@/src/lib/mockData';
import { InfoTooltip } from '@/src/components/InfoTooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { Label } from '@/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';

export default function EnrollmentView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    district: 'All',
    department: 'All',
    riskLevel: 'All',
    status: 'All'
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => {
      if (searchTerm && !emp.name.toLowerCase().includes(searchTerm.toLowerCase()) && !emp.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.district !== 'All' && emp.district !== filters.district) return false;
      if (filters.department !== 'All' && emp.department !== filters.department) return false;
      if (filters.riskLevel !== 'All' && emp.riskLevel !== filters.riskLevel) return false;
      if (filters.status !== 'All' && emp.status !== filters.status) return false;
      return true;
    });
  }, [searchTerm, filters]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const districts = ['All', 'Richmond', 'Salem', 'Bristol', 'Lynchburg', 'Hampton Roads'];
  const departments = ['All', 'Maintenance', 'Construction', 'Engineering', 'Safety', 'HR'];
  const risks = ['All', 'Low', 'Medium', 'High'];
  const statuses = ['All', 'Cleared', 'Pending Review', 'Overdue', 'On Hold'];

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            Employee Registry
            <InfoTooltip 
              title="Employee Registry" 
              description="Central database for all employees enrolled in occupational health programs."
              oshaRef="29 CFR 1904.29 - Form 301 Requirements"
              aiNote="Added 12 new employees to the registry this month."
            />
          </h2>
          <p className="text-muted-foreground mt-1">Manage occupational health enrollments and records.</p>
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm flex items-center shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Enroll Employee
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, ID..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <button className="px-4 py-2 bg-card border border-border rounded-md text-sm font-medium flex items-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
              {(filters.district !== 'All' || filters.department !== 'All' || filters.riskLevel !== 'All' || filters.status !== 'All') && (
                <span className="ml-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 border border-border bg-card shadow-2xl rounded-xl z-50">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm border-b border-border pb-2">Filter Employees</h4>
              
              <div className="space-y-2">
                <Label className="text-xs">District</Label>
                <Select value={filters.district} onValueChange={v => { setFilters({...filters, district: v}); setPage(1); }}>
                  <SelectTrigger className="w-full text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>{districts.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Department</Label>
                <Select value={filters.department} onValueChange={v => { setFilters({...filters, department: v}); setPage(1); }}>
                  <SelectTrigger className="w-full text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Risk Level</Label>
                <Select value={filters.riskLevel} onValueChange={v => { setFilters({...filters, riskLevel: v}); setPage(1); }}>
                  <SelectTrigger className="w-full text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>{risks.map(r => <SelectItem key={r} value={r} className="text-xs">{r === 'All' ? 'All Risks' : r}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Status</Label>
                <Select value={filters.status} onValueChange={v => { setFilters({...filters, status: v}); setPage(1); }}>
                  <SelectTrigger className="w-full text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map(s => <SelectItem key={s} value={s} className="text-xs">{s === 'All' ? 'All Statuses' : s}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <button 
                onClick={() => {
                  setFilters({ district: 'All', department: 'All', riskLevel: 'All', status: 'All' });
                  setPage(1);
                  setSearchTerm('');
                }}
                className="w-full mt-2 border border-border bg-muted/50 hover:bg-muted text-xs font-semibold py-1.5 rounded-md text-foreground transition-colors"
              >
                Clear All
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 overflow-auto flex flex-col relative z-0">
        <div className="flex-1 overflow-auto relative rounded-t-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap table-fixed border-collapse">
            <thead className="bg-muted/90 backdrop-blur-md text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_0_var(--color-border)]">
              <tr className="border-b border-border">
                <th className="font-medium p-0 border-r border-border/10">
                  <div className="px-6 py-4 resize-x overflow-auto w-48 min-w-[120px] max-w-full">Employee</div>
                </th>
                <th className="font-medium p-0 border-r border-border/10">
                  <div className="px-6 py-4 resize-x overflow-auto w-32 min-w-[80px] max-w-full">District</div>
                </th>
                <th className="font-medium p-0 border-r border-border/10">
                  <div className="px-6 py-4 resize-x overflow-auto w-40 min-w-[100px] max-w-full">Department</div>
                </th>
                <th className="font-medium p-0 border-r border-border/10">
                  <div className="px-6 py-4 resize-x overflow-auto w-32 min-w-[80px] max-w-full">Risk Level</div>
                </th>
                <th className="font-medium p-0 border-r border-border/10">
                  <div className="px-6 py-4 resize-x overflow-auto w-36 min-w-[120px] max-w-full">Status</div>
                </th>
                <th className="font-medium px-6 py-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3">
                    <div className="font-medium text-foreground truncate">{emp.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">{emp.id}</div>
                  </td>
                  <td className="px-6 py-3 truncate">{emp.district}</td>
                  <td className="px-6 py-3 truncate">{emp.department}</td>
                  <td className="px-6 py-3">
                    <Badge variant="outline" className={
                      emp.riskLevel === 'High' ? 'border-destructive text-destructive' :
                      emp.riskLevel === 'Medium' ? 'border-orange-500 text-orange-500' :
                      'border-emerald-500 text-emerald-500'
                    }>
                      {emp.riskLevel} Risk
                    </Badge>
                  </td>
                  <td className="px-6 py-3">
                    <Badge className={
                      emp.status === 'Cleared' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border border-transparent' :
                      emp.status === 'Overdue' ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none border-destructive/20' :
                      emp.status === 'Pending Review' ? 'bg-primary/10 text-primary hover:bg-primary/20 shadow-none border-primary/20' : 
                      'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 shadow-none border-orange-500/20'
                    }>
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-muted-foreground hover:text-primary transition-colors p-1" title="View Records">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="text-muted-foreground hover:text-primary transition-colors p-1" title="View Exposures">
                        <Activity className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-muted-foreground">
                    No employees found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 0 && (
          <div className="bg-card border-x border-b border-border p-3 flex items-center justify-between shrink-0 px-6 shrink-0 z-10 w-full rounded-b-xl shadow-sm">
            <div className="text-xs text-muted-foreground">
              Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-xs font-medium px-2">Page {page} of {totalPages}</div>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
