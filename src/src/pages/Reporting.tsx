import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import QueryEditor from '../components/common/QueryEditor';

import QueryResult from '@/components/common/QueryResult';
import ColumnSelectionDataTable, { ColumnData } from '@/components/reportingComponents/ColumnSelectionDataTable';
import ExportPopup from '@/components/reportingComponents/exportPopup';
import ReportingTopbar from '@/components/reportingComponents/reportingTopbar';
import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { useToast } from '@/components/ui/use-toast';
import { WebendpointConstant } from '@/constant/apiConstants';

function Reporting() {
  // State to store selected values
  const [selectedSchema, setSelectedSchema] = useState<string >('');
  const [selectedLimits, setSelectedLimits] = useState<string >('');
  const [selectedTable, setSelectedTable] = useState<string >('');
  const [selectedWhereCondition, setSelectedWhereCondition] = useState<string | null>(null);
  const [selectedOrderCondition, setSelectedOrderCondition] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [columnData, setColumnData] = useState<ColumnData[] | []>([]);
  const [orderData, setOrderData] = useState<[]>([]);
  const [query, setQuery] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<{ [key: string]: boolean }>({});
  const [isQueryEditorOpen, setIsQueryEditorOpen] = useState(false);
  const [queryResult, setQueryResult] = useState<any>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const archive_id = searchParams.get('archive_id');
  const archive_name = searchParams.get('archive_name');
  const [databaseName, setDatabaseName] = useState<string>('');
  const [isColumnLoading, setIsColumnLoading] = useState(false);

  const { data: schemas, isLoading: schemasLoading } = useQuery({
    queryKey: ['schemas', archive_id],
    queryFn: async () => {
      const res = await fetch(
        'https://o33dd0mr26.execute-api.us-east-1.amazonaws.com/' + WebendpointConstant.GET_SCHEMAS_API,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ archive_id }),
        },
      );
      if (!res.ok) throw new Error('Failed to fetch schemas');
      const data = await res.json();
      setDatabaseName(data.database_name);
      return data.schemas;
    },
  });

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ['tables', selectedSchema],
    queryFn: async () => {
      if (!selectedSchema) return [];
      const res = await fetch(
        'https://o33dd0mr26.execute-api.us-east-1.amazonaws.com/' + WebendpointConstant.GET_TABLES_API,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ archive_id, schema_name: selectedSchema }),
        },
      );
      if (!res.ok) throw new Error('Failed to fetch tables');
      const data = await res.json();
      return data;
    },
    enabled: !!selectedSchema,
  });

  useEffect(()=>{
    setSelectedTable('')
  }, [selectedSchema])

  useEffect(() => {
    setSelectedTable('');
  }, [selectedSchema]);

  useEffect(() => {
    // Set selected columns after columnData is set
    setSelectedColumns(Object.fromEntries(columnData.map((row) => [row.id, true])));
  }, [columnData]);

  useEffect(() => {
    fetchColumnDetails();
  }, [selectedTable]);

  const handleColumnSelectionChange = (selection: { [key: string]: boolean }) => {
    setSelectedColumns(selection);
  };

  const fetchColumnDetails = async () => {
    setIsColumnLoading(true);
    const response = await fetch(
      'https://o33dd0mr26.execute-api.us-east-1.amazonaws.com/' + WebendpointConstant.GET_COLUMNS_API,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          archive_id: archive_id,
          schema_name: selectedSchema,
          table_name: selectedTable,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to execute query');
    }
    let data = await response.json();
    setOrderData(data);
    data = data.map((column: any, index: { toString: () => any }) => ({
      id: index.toString(),
      column: column,
    }));
    setColumnData(data);
    setIsColumnLoading(false);
  };

  const buildQuery = () => {
    if (!selectedSchema) {
      toast({
        variant: 'destructive',
        title: 'Schema Missing.',
        description: 'Please select a schema before generating the query.',
      });
      return;
    }
    if (!selectedTable) {
      toast({
        variant: 'destructive',
        title: 'Table Missing.',
        description: 'Please select a table before generating the query.',
      });
      return;
    }
    if (Object.keys(selectedColumns).length === 0) {
      toast({
        variant: 'destructive',
        title: 'Columns Missing.',
        description: 'Please select atleast one column before generating the query.',
      });
      return;
    }
    let selectedColumnNames = '';
    if (columnData.length === Object.keys(selectedColumns).length) {
      selectedColumnNames = '*';
    } else {
      const selectedColumnIds = Object.keys(selectedColumns).filter((key) => selectedColumns[key]);

      selectedColumnNames = columnData
        .filter((col) => selectedColumnIds.includes(col.id))
        .map((col) => col.column)
        .join(', ');
    }

    let generated = `SELECT ${selectedColumnNames} FROM "${selectedTable}"`;
    if (selectedWhereCondition) {
      generated += ` WHERE ${selectedWhereCondition}`;
    }
    if (selectedOrderCondition) {
      generated += ` ORDER BY ${selectedOrderCondition} ${selectedOrder}`;
    }
    if (selectedLimits) {
      generated += ` LIMIT ${selectedLimits}`;
    }
    generated += ';';
    setQuery(generated);
    return generated;
  };

  function previewQuerryClicked() {
    if (buildQuery()) {
      setIsPreviewOpen(true);
    }
  }

  function resetValues() {
    setSelectedSchema('');
    setSelectedTable('');
    setSelectedLimits('');
    setColumnData([...columnData]);
    setSelectedOrderCondition(null);
    setSelectedOrder('');
    setSelectedWhereCondition('');
    setQueryResult([]);
  }

  interface RowData {
    Data: { VarCharValue?: string }[];
  }

  interface InputData {
    Rows: RowData[];
  }

  const handleAthenaTransformation = (data: InputData) => {
    // Extract column names from the first row
    const columns: string[] = data.Rows[0].Data.map((item) => item.VarCharValue || '');

    // Convert rows to list of objects
    const rows: Record<string, string | null>[] = [];
    if (data.Rows.length === 1){
      const rowData: Record<string, string | null> = {};
      for (let j = 0; j < data.Rows[0].Data.length; j++) {
        const key = columns[j];
        const value = '';
        rowData[key] = value;
      }
      rows.push(rowData);
    } else{
      for (let i = 1; i < data.Rows.length; i++) {
        const rowData: Record<string, string | null> = {};
        for (let j = 0; j < data.Rows[i].Data.length; j++) {
          const key = columns[j];
          const value = data.Rows[i].Data[j].VarCharValue || null;
          rowData[key] = value;
        }
        rows.push(rowData);
      }
    }
    setQueryResult(rows);
  };

  const executeQueryMutation = useMutation({
    mutationFn: async (sqlQuery: string) => {
      const response = await fetch(
        'https://o33dd0mr26.execute-api.us-east-1.amazonaws.com/' + WebendpointConstant.EXECUTE_QUERY_API,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sql_statement: sqlQuery,
            database_name: databaseName,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to execute query');
      }

      const data = await response.json();
      return data.ResultSet;
    },
    onSuccess: (data) => {
      handleAthenaTransformation(data);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Query Execution Failed',
        description: error.message,
      });
    },
  });

  const handleExecuteQuery = () => {
    const latestQuery = buildQuery();
    if (latestQuery) {
      executeQueryMutation.mutate(latestQuery);
    }
  };

  const handleCustomQuery = (query: string) => {
    executeQueryMutation.mutate(query);
  };

  return (
    <>
      <h2 className='font-medium leading-10 tracking-tight md:text-[30px] md:leading-[3.25rem]'>
        Execute Query On Application: {archive_name}
      </h2>
      <Separator className='mb-4 mt-4' />
      <ReportingTopbar
        schemas={schemas || []}
        tables={tables || []}
        limits={['10']}
        setSelectedSchema={setSelectedSchema}
        setSelectedTable={setSelectedTable}
        setSelectedLimit={setSelectedLimits}
        selectedSchema={selectedSchema || ''}
        selectedTable={selectedTable || ''}
        selectedLimit={selectedLimits || ''}
        databaseName={databaseName}
        tablesLoading={tablesLoading}
        schemasLoading={schemasLoading}
      />

      <div className='place-self-center pb-4 pt-8'>
        <strong>Data Columns</strong>
      </div>

      <div className='flex flex-row justify-between'>
        <div className='flex flex-col pr-5'>
          <div>
            {' '}
            <strong>Display Columns</strong>
          </div>
          <div>
            <ColumnSelectionDataTable
              columnData={columnData}
              rowSelection={selectedColumns}
              setRowSelection={handleColumnSelectionChange}
            />
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='flex flex-row justify-between'>
            <span className='w-100 mr-40 flex flex-col'>
              <div className='pb-4'>
                {' '}
                <strong>
                  Where Clause <em>(Optional)</em>{' '}
                </strong>
              </div>
              <Textarea
                value={selectedWhereCondition || ''}
                onChange={(e) => setSelectedWhereCondition(e.target.value)}
                placeholder="Enter Where Conditional here Ex. Column1 = 'Value'..."
                rows={10}
                cols={70}
              />
            </span>
            <span className='flex flex-col'>
              <div className='pb-4'>
                {' '}
                <strong>
                  Order By <em>(Optional)</em>
                </strong>
              </div>
              <Combobox
                label='Column'
                items={orderData || []}
                selectedValue={selectedOrderCondition || ''}
                setSelectedValue={setSelectedOrderCondition}
                isLoading={isColumnLoading}
              />

              <div className='pb-4 pt-4'>
                {' '}
                <strong>
                  Order <em>(Optional)</em>
                </strong>
              </div>
              <Combobox
                label='Order'
                items={['ASC', 'DESC']}
                selectedValue={selectedOrder || ''}
                setSelectedValue={setSelectedOrder}
              />
            </span>
            <div></div>
          </div>
          <div className='self-end'>
            <Button onClick={previewQuerryClicked}> Preview Query </Button>
          </div>
        </div>
      </div>

      <div className='flex flex-row justify-between pt-16'>
        <div>
          <Button onClick={() => setIsQueryEditorOpen(true)}>Open Query Editor</Button>
          {isQueryEditorOpen && (
            <QueryEditor
              schemas={schemas || []}
              tables={tables || []}
              setSelectedSchema={setSelectedSchema}
              setSelectedTable={setSelectedTable}
              selectedSchema={selectedSchema}
              selectedTable={selectedTable}
              columns={orderData || []}
              queryResult={queryResult || []}
              handleCustomQuery={handleCustomQuery}
              onClose={() => setIsQueryEditorOpen(false)}
              executeQueryMutation={executeQueryMutation}
            />
          )}
        </div>
        <div className='flex w-[300px] justify-between'>
          <Button onClick={handleExecuteQuery}>
            {executeQueryMutation.isPending ? 'Loading Result...' : 'Execute Query'}
          </Button>
          <Button onClick={resetValues}> Reset </Button>
          <Button onClick={() => navigate('/dashboard')}> Back </Button>
        </div>
      </div>
      {queryResult?.length !== 0 && (
        <div className='mt-6'>
          <QueryResult data={queryResult || []} maxHeight='100%' />
        </div>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className='size-fit'>
          <DialogHeader>
            <DialogTitle>Generated SQL Query</DialogTitle>
          </DialogHeader>
          <span className='break-words rounded-md p-4 text-sm'>{query}</span>
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className='flex justify-end pt-4'>
        {queryResult?.length !== 0 && (
          <span>
            <ExportPopup queryResult={queryResult} />
            <Button className='ml-4' onClick={() => navigate('/dashboard')}>
              {' '}
              Back{' '}
            </Button>
          </span>
        )}
      </div>
    </>
  );
}

export default Reporting;
