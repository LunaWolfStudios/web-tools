import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, FileText, Activity, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { mockEmployees as initialMockEmployees } from '@/src/lib/mockData';
import { InfoTooltip } from '@/src/components/InfoTooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { Label } from '@/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';

export default function EnrollmentView() {
  const [employees, setEmployees] = useState(initialMockEmployees);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', district: 'Richmond', department: 'Maintenance', riskLevel: 'Low' });
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
    return employees.filter(emp => {
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

  const handleEnroll = () => {
    if (!newEmployee.name) return;
    const newEmp = {
      id: `EMP-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newEmployee.name,
      district: newEmployee.district,
      department: newEmployee.department,
      riskLevel: newEmployee.riskLevel,
      status: 'Pending Review'
    };
    setEmployees([newEmp, ...employees]);
    setIsEnrollDialogOpen(false);
    setNewEmployee({ name: '', district: 'Richmond', department: 'Maintenance', riskLevel: 'Low' });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'All').length;
  
  const getFilterColor = (key: string) => {
    switch(key) {
      case 'district': return 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-500';
      case 'department': return 'bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20 hover:text-purple-500';
      case 'riskLevel': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 hover:text-amber-500';
      case 'status': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-500';
      default: return '';
    }
  };

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
              aiNote={`Added ${employees.length - initialMockEmployees.length} new employees to the registry this session.`}
            />
          </h2>
          <p className="text-muted-foreground mt-1">Manage occupational health enrollments and records.</p>
        </div>
        
        <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm flex items-center shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Enroll Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enroll New Employee</DialogTitle>
              <DialogDescription>
                Add a new employee to the occupational health registry.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={newEmployee.name} 
                  onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} 
                  placeholder="e.g. John Doe" 
                />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Select value={newEmployee.district} onValueChange={v => setNewEmployee({...newEmployee, district: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{districts.filter(d => d !== 'All').map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={newEmployee.department} onValueChange={v => setNewEmployee({...newEmployee, department: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.filter(d => d !== 'All').map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Risk Level</Label>
                <Select value={newEmployee.riskLevel} onValueChange={v => setNewEmployee({...newEmployee, riskLevel: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{risks.filter(d => d !== 'All').map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEnroll} disabled={!newEmployee.name}>Enroll Now</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 shrink-0">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search by name, ID..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-card border border-border rounded-md text-sm font-medium flex items-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </span>
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
        
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 items-center min-h-[40px]">
            <span className="text-xs text-muted-foreground mr-1">Active:</span>
            {Object.entries(filters).map(([key, val]) => {
              if (val === 'All') return null;
              return (
                <Badge key={key} variant="outline" className={`pl-2 pr-1 py-1 gap-1 cursor-pointer transition-colors ${getFilterColor(key)}`} onClick={() => setFilters({...filters, [key]: 'All'})}>
                  <span className="capitalize">{key === 'riskLevel' ? 'Risk' : key}:</span> {val}
                  <X className="w-3 h-3 ml-1 opacity-70 hover:opacity-100" />
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto flex flex-col relative z-0">
        <div className="flex-1 overflow-x-auto relative rounded-t-xl border border-border bg-card shadow-sm min-w-0">
          <table className="w-full text-left text-sm table-auto border-collapse min-w-[800px]">
            <thead className="bg-muted/90 backdrop-blur-md text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_0_var(--color-border)]">
              <tr className="border-b border-border">
                <th className="font-medium p-4 pl-6 border-r border-border/10">Employee</th>
                <th className="font-medium p-4 border-r border-border/10">District</th>
                <th className="font-medium p-4 border-r border-border/10">Department</th>
                <th className="font-medium p-4 border-r border-border/10">Risk Level</th>
                <th className="font-medium p-4 border-r border-border/10">Status</th>
                <th className="font-medium p-4 pr-6 text-right w-24">Actions</th>
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
