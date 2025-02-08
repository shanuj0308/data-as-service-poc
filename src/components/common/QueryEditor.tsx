import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/text-area';
import { Checkbox } from '@/components/ui/checkbox';

interface QueryEditorProps {
  schemas: string[];
  tables: string[];
  columns: { id: string; column: string }[];
  onClose: () => void;
}

export default function QueryEditor({
  schemas,
  tables,
  columns,
  onClose,
}: QueryEditorProps) {
  const [selectedSchema, setSelectedSchema] = useState<string>(
    schemas[0] || '',
  );
  const [selectedTable, setSelectedTable] = useState<string>(tables[0] || '');
  const [whereCondition, setWhereCondition] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [outputLimit, setOutputLimit] = useState<string>('100');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['*']);
  const [query, setQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    buildQuery();
  }, [
    selectedSchema,
    selectedTable,
    whereCondition,
    orderBy,
    outputLimit,
    selectedColumns,
  ]);

  const buildQuery = () => {
    const columnsPart = selectedColumns.includes('*')
      ? '*'
      : selectedColumns.join(', ');
    let query = `SELECT ${columnsPart} FROM ${selectedTable}`;
    if (whereCondition) query += ` WHERE ${whereCondition}`;
    if (orderBy) query += ` ORDER BY ${orderBy}`;
    query += ` LIMIT ${outputLimit}`;
    setQuery(query);
  };

  const handleColumnToggle = (column: string) => {
    if (column === '*') {
      setSelectedColumns(['*']);
    } else {
      setSelectedColumns((prev) => {
        if (prev.includes('*')) return [column];
        if (prev.includes(column)) return prev.filter((col) => col !== column);
        return [...prev, column];
      });
    }
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
    buildQuery();
  };

  const getDisplayColumns = () => {
    if (selectedColumns.includes('*')) return 'All (*)';
    if (selectedColumns.length > 3)
      return `${selectedColumns.slice(0, 3).join(', ')}, ...`;
    return selectedColumns.join(', ') || 'Select Columns';
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='mx-auto w-full max-w-3xl rounded-xl border bg-white p-4 shadow-lg dark:bg-gray-800'>
        <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-gray-100'>
          Query Editor
        </h2>

        <div className='mb-4 flex gap-4'>
          <Select
            onValueChange={setSelectedSchema}
            defaultValue={selectedSchema}
          >
            <SelectTrigger className='w-48 bg-gray-100 dark:bg-gray-700 dark:text-gray-100'>
              <SelectValue placeholder='Select Schema' />
            </SelectTrigger>
            <SelectContent>
              {schemas.map((schema) => (
                <SelectItem key={schema} value={schema}>
                  {schema}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedTable} defaultValue={selectedTable}>
            <SelectTrigger className='w-48 bg-gray-100 dark:bg-gray-700 dark:text-gray-100'>
              <SelectValue placeholder='Select Table' />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table} value={table}>
                  {table}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            type='number'
            className='w-20 rounded-md border bg-gray-100 p-2 dark:bg-gray-700 dark:text-gray-100'
            value={outputLimit}
            onChange={(e) => setOutputLimit(e.target.value)}
            placeholder='Limit'
          />
        </div>

        <div className='mb-4'>
          <label className='mb-2 block font-semibold text-gray-900 dark:text-gray-100'>
            Select Columns:
          </label>
          <div className='relative'>
            <div
              className='w-full cursor-pointer rounded-md border bg-gray-100 p-2 dark:bg-gray-700 dark:text-gray-100'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {getDisplayColumns()}
            </div>
            {isDropdownOpen && (
              <div className='absolute z-10 mt-1 w-full rounded-md border bg-white p-2 shadow-md dark:bg-gray-800'>
                <div className='flex items-center gap-2 p-1'>
                  <Checkbox
                    checked={selectedColumns.includes('*')}
                    onCheckedChange={() => handleColumnToggle('*')}
                  />
                  <span>All (*)</span>
                </div>
                {columns.map((col) => (
                  <div key={col.id} className='flex items-center gap-2 p-1'>
                    <Checkbox
                      checked={selectedColumns.includes(col.column)}
                      onCheckedChange={() => handleColumnToggle(col.column)}
                    />
                    <span>{col.column}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Textarea
          className='mb-4 w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-100'
          rows={3}
          placeholder='WHERE condition (optional)'
          value={whereCondition}
          onChange={(e) => setWhereCondition(e.target.value)}
        />

        <Select onValueChange={setOrderBy}>
          <SelectTrigger className='w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-100'>
            <SelectValue placeholder='Order By (optional)' />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col.id} value={col.column}>
                {col.column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className='mt-4 rounded-md border bg-gray-50 p-3 dark:bg-gray-700 dark:text-gray-100'>
          <strong>Generated Query:</strong>
          <pre className='mt-2 whitespace-pre-wrap break-words'>{query}</pre>
        </div>

        <div className='mt-4 flex justify-end gap-4'>
          <Button onClick={onClose} variant='outline'>
            Cancel
          </Button>
          <Button>Execute Query</Button>
        </div>

        <div className='mt-6 flex justify-center'>
          <Button className='rounded-xl bg-blue-500 px-4 py-2 font-bold text-white shadow-md hover:bg-blue-700'>
            Click here to open QueryCanvas
          </Button>
        </div>
      </div>
    </div>
  );
}
