import Combobox from "../ui/combobox";

interface ReportingTopbarProps {
  schemas: string[];
  tables: string[];
  limits: string[];
  setSelectedSchema: (value: string) => void;
  setSelectedTable: (value: string) => void;
  setSelectedLimit: (value: string) => void;
  selectedSchema: string;
  selectedTable: string;
  selectedLimit: string;
  databaseName: string;
  tablesLoading: boolean;
  schemasLoading: boolean;
}

const ReportingTopbar = ({
  schemas,
  tables,
  limits,
  setSelectedSchema,
  setSelectedTable,
  setSelectedLimit,
  selectedSchema,
  selectedTable,
  selectedLimit,
  databaseName,
  tablesLoading,
  schemasLoading
}: ReportingTopbarProps) => {
  return (
    <div className='flex flex-row justify-between'>
      <div className='flex flex-col'>
        <div><strong>Database Name</strong></div>
        <div className='pt-3'>{databaseName ? databaseName : "Database Loading..."}</div>
      </div>
      <div>
      <div className="pb-2"> <strong>Schema</strong></div>
      <Combobox label='Schema' items={schemas} selectedValue={selectedSchema} setSelectedValue={setSelectedSchema} isLoading={schemasLoading}/>
      </div>
      <div>
      <div className="pb-2"> <strong>Table</strong></div>
      <Combobox label='Table' items={tables} selectedValue={selectedTable} setSelectedValue={setSelectedTable} isLoading={tablesLoading}/>
      </div>
      <div>
      <div className="pb-2"> <strong>Limit  <em>(Optional)</em></strong></div>
      <Combobox label='Limit' items={limits} selectedValue={selectedLimit} setSelectedValue={setSelectedLimit} />
      </div>
    </div>
  );
};

export default ReportingTopbar;
