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
import QueryResult from '../common/QueryResult';

interface QueryEditorProps {
  schemas: string[];
  tables: { [key: string]: string[] };
  columns: { [key: string]: string[] };
  onClose: () => void;
}

export default function QueryEditor({
  schemas,
  tables,
  columns,
  onClose,
}: QueryEditorProps) {
  const [selectedSchema, setSelectedSchema] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<
    { id: number; name: string; age: number }[]
  >([]);

  const dummyData = {
    Schema1: { TB1: ['Col1', 'Col2', 'Col3'], TB2: ['Col4', 'Col5'] },
    Schema2: { TB3: ['Col6', 'Col7'], TB4: ['Col8', 'Col9'] },
    Schema3: { TB5: ['Col10', 'Col11', 'Col12'], TB6: ['Col13', 'Col14'] },
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSchemaChange = (schema: string) => {
    setSelectedSchema(schema);
    setSelectedTable('');
  };

  const handleTableChange = (table: string) => {
    setSelectedTable(table);
  };

  const handleExecuteQuery = () => {
    setQueryResult([
      { id: 1, name: 'John Doe', age: 28 },
      { id: 2, name: 'Jane Smith', age: 34 },
    ]);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='mx-auto w-full max-w-3xl rounded-xl border bg-white p-4 shadow-lg dark:bg-gray-800'>
        <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-gray-100'>
          Query Editor
        </h2>

        <div className='mb-4 flex gap-4'>
          {/* Schema Selection */}
          <Select onValueChange={handleSchemaChange} value={selectedSchema}>
            <SelectTrigger className='w-48 bg-gray-100 dark:bg-gray-700 dark:text-gray-100'>
              <SelectValue placeholder='Select Schema' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(dummyData).map((schema) => (
                <SelectItem key={schema} value={schema}>
                  {schema}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Table Selection */}
          <Select
            onValueChange={handleTableChange}
            value={selectedTable}
            disabled={!selectedSchema}
          >
            <SelectTrigger className='w-48 bg-gray-100 dark:bg-gray-700 dark:text-gray-100'>
              <SelectValue placeholder='Select Table' />
            </SelectTrigger>
            <SelectContent>
              {selectedSchema &&
                Object.keys(dummyData[selectedSchema]).map((table) => (
                  <SelectItem key={table} value={table}>
                    {table}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Column View (Non-selectable) */}
          <Select disabled={!selectedTable}>
            <SelectTrigger className='w-48 bg-gray-100 dark:bg-gray-700 dark:text-gray-100'>
              <SelectValue placeholder='View Columns' />
            </SelectTrigger>
            <SelectContent>
              {selectedSchema &&
                selectedTable &&
                dummyData[selectedSchema][selectedTable].map((col) => (
                  <SelectItem key={col} value={col} disabled>
                    {col}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <Textarea
          className='w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-100'
          rows={6}
          placeholder='Write your custom SQL query here...'
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
        />

        <div className='mt-8 flex items-center justify-between'>
          <Button className='rounded-xl bg-blue-500 px-4 py-2 font-bold text-white shadow-md hover:bg-blue-700'>
            Click here to open QueryCanvas
          </Button>
          <div className='flex gap-4'>
            <Button onClick={onClose} variant='outline'>
              Cancel
            </Button>
            <Button onClick={handleExecuteQuery}>Execute Query</Button>
          </div>
        </div>

        {queryResult && (
          <div className='mt-6'>
            <QueryResult data={queryResult} />
          </div>
        )}
      </div>
    </div>
  );
}
