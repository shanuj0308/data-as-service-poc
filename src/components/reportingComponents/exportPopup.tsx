import { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function ExportPopup({ queryResult }: { queryResult: any }) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');

  const handleDownload = () => {
    if (!queryResult || queryResult.length === 0) return;

    if (exportFormat === 'csv') {
      downloadCSV(queryResult);
    } else if (exportFormat === 'excel') {
      downloadExcel(queryResult);
    }
    setIsExportOpen(false);
  };

  const downloadCSV = (data: any) => {
    if (!data || data.length === 0) {
        console.error("No data available to export.");
        return;
    }

    const headers = Object.keys(data[0]).join(',');
    
    const escapeCSVValue = (value: any) => {
        if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`; // Escape double quotes
        }
        return value;
    };

    const rows = data.map((row:any) => 
        Object.values(row).map(escapeCSVValue).join(',')
    ).join('\n');

    const csvString = `${headers}\n${rows}`;
    const blob = new Blob([csvString], { type: 'text/csv' });
    
   saveAs(blob, 'exported_data.csv')
};

  const downloadExcel = (data: any) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'exported_data.xlsx');
  };

  return (
    <>
      <Button onClick={() => setIsExportOpen(true)}>Export</Button>
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
          </DialogHeader>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Format' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='csv'>CSV</SelectItem>
              <SelectItem value='excel'>Excel</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleDownload}>Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ExportPopup;
