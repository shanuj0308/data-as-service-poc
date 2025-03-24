import { useEffect, useState } from 'react';

import QueryResult from '@/components/common/QueryResult';
import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/text-area';

type QueryEditorProps = {
  schemas: string[];
  tables: string[];
  setSelectedSchema: (schema: string) => void;
  setSelectedTable: (table: string) => void;
  selectedSchema: string | null;
  selectedTable: string | null;
  columns: string[] | [];
  queryResult: Array<Record<string, unknown>>;
  handleCustomQuery: (query: string) => void;
  onClose: () => void;
  executeQueryMutation?: any;
};

// Export the QueryEditor function as the default export
export default function QueryEditor({
  schemas,
  tables, // Array of tables
  setSelectedSchema, // Function to set the selected schema
  setSelectedTable, // Function to set the selected table
  selectedSchema, // Selected schema
  selectedTable, // Selected table
  columns, // Array of columns
  queryResult,
  handleCustomQuery,
  onClose,
  executeQueryMutation,
}: QueryEditorProps) {
  // State to store the custom query
  const [customQuery, setCustomQuery] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<string>('');

  // UseEffect to prevent scrolling when the query editor is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Function to handle executing the custom query
  const handleExecuteQuery = () => {
    handleCustomQuery(customQuery);
  };

  return (
    // Container for the query editor
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='mx-auto max-h-[745px] w-full max-w-[785px] rounded-xl border bg-white p-4 shadow-lg dark:bg-gray-800'>
        <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-gray-100'>Query Editor</h2>

        <div className='mb-4 flex gap-4'>
          {/* Schema Selection */}
          <div>
            <div className="pb-2"> <strong>Schema</strong></div>
            <Combobox
              label='Schema'
              items={schemas}
              selectedValue={selectedSchema || ''}
              setSelectedValue={setSelectedSchema}
            />
          </div>

          {/* Table Selection */}
          <div>
          <div className="pb-2"><strong>Table</strong></div>
          <Combobox
            label='Table'
            items={tables}
            selectedValue={selectedTable || ''}
            setSelectedValue={setSelectedTable}
          />
          </div>

          {/* Column View*/}
          <div>
          <div className="pb-2"><strong>Column</strong></div>
          <Combobox label='Column' items={columns} selectedValue={selectedColumn} setSelectedValue={setSelectedColumn} />
          </div>
        </div>
        <Textarea
          className='w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-100'
          rows={6}
          placeholder='Write your custom SQL query here...'
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
        />

        <div className='mt-8 flex items-center justify-between'>
          <div></div>
          <div className='flex gap-4'>
            <Button onClick={onClose} variant='outline'>
              Cancel
            </Button>
            <Button onClick={handleExecuteQuery}>
              {executeQueryMutation?.isPending ? 'Loading Result...' : 'Execute Query'}
            </Button>
          </div>
        </div>

        {queryResult && (
          <div className='mt-6'>
            <QueryResult data={queryResult} maxHeight='320px' />
          </div>
        )}
      </div>
    </div>
  );
}
