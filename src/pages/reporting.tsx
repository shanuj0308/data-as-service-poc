import { SetStateAction,useEffect, useState } from "react";

import ColumnSelectionDataTable, { ColumnData } from "@/components/reportingComponents/ColumnSelectionDataTable";
import ReportingTopbar from "@/components/reportingComponents/reportingTopbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/text-area";

function Reporting() {
  // State for dropdown values
  const [schemas, setSchemas] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [limits, setLimits] = useState<string[]>([]);

  // State to store selected values
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [selectedLimits, setSelectedLimits] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedWhereCondition, setSelectedWhereCondition] = useState<string | null>(null);
  const [selectedOrderCondition, setSelectedOrderCondition] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [columnData, setColumnData] = useState<ColumnData[] | []>([]);
  const [selectedColumns, setSelectedColumns] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    // Simulating an API call (Replace this with actual API fetch)
    setSchemas(["Schema1", "Schema2", "Schema3"]);
    setTables(["TB1", "TB2", "TB3"]);
    setLimits(["10", "50", "100"]);
    setColumnData([
      { id: "0", column: "Col1" },
      { id: "1", column: "Col2" },
      { id: "2", column: "Col3" },
      { id: "3", column: "Col4" },
      { id: "4", column: "Col5" },
      { id: "5", column: "Col6" },
      { id: "6", column: "Col17" },
      { id: "7", column: "Col8" },
      { id: "8", column: "Col9" },
      { id: "9", column: "Col10" },
      { id: "10", column: "Col11" },
      { id: "11", column: "Col12" },
      { id: "12", column: "Col13" },
    ]);
  }, []);

  useEffect(() => {
    // Set selected columns after columnData is set
    setSelectedColumns(Object.fromEntries(columnData.map((row) => [row.id, true])));
  }, [columnData]);

  const handleColumnSelectionChange = (selection: {[key: string]: boolean}) => {
    setSelectedColumns(selection);
  }

  const handleWhereCondition = (event: { target: { value: SetStateAction<string | null>; }; }) => {
    setSelectedWhereCondition(event.target.value);
  }

  const buildQuery = () => {
    let selectedColumnNames = '';
    if (columnData.length === Object.keys(selectedColumns).length){
      selectedColumnNames = '*';
    } else {
      const selectedColumnIds = Object.keys(selectedColumns).filter(
        (key) => selectedColumns[key]
      );
    
      selectedColumnNames = columnData
        .filter((col) => selectedColumnIds.includes(col.id))
        .map((col) => col.column)
        .join(', ');
    }

      
    let generated = `SELECT ${selectedColumnNames} FROM ${selectedSchema}.${selectedTable}`
    if (selectedWhereCondition){
      generated += ` WHERE ${selectedWhereCondition}`
    }
    if (selectedOrderCondition){
      generated += ` ORDER BY ${selectedOrderCondition} ASC`
    }
    if (selectedLimits){
      generated += ` LIMIT ${selectedLimits}`
    }
    console.log(generated)
  };

  function previewQuerryClicked(){
    buildQuery()
    setIsPreviewOpen(true);
  }

  return (
    <>
      <div className="place-self-center pb-4">Criteria</div>
      <ReportingTopbar
        schemas={schemas}
        tables={tables}
        limits={limits}
        setSelectedSchema={setSelectedSchema}
        setSelectedDatabase={setSelectedTable}
        setSelectedLimit={setSelectedLimits}
      />

      <div className="place-self-center pb-4 pt-8">Data Columns</div>

      <div className="flex flex-row justify-between">
        <div className="flex flex-col pr-5">
          <div> Display Columns</div>
          <div>
            <ColumnSelectionDataTable  
            columnData={columnData}
            rowSelection={selectedColumns}
            setRowSelection={handleColumnSelectionChange}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <span className="flex flex-col w-100 mr-40">
              <div className="pb-4"> Where Clause <em>(Optional)</em> </div>
              <Textarea onChange={handleWhereCondition} placeholder="Enter Where Conditional here Ex. Column1 = 'Value'..." rows={10} cols={70} />
            </span>
            <span className="flex flex-col">
              <div className="pb-4"> Order By <em>(Optional)</em></div>
              <Select onValueChange={setSelectedOrderCondition}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select Column" />
                </SelectTrigger>
                <SelectContent>
                  {columnData.map((col) => (
                    <SelectItem key={col.id} value={col.column}>
                      {col.column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </span>
          </div>
          <div className="self-end">
          <Button onClick={previewQuerryClicked}> Preview Query </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between pt-16">
      <div>
          <Button> Open Query Editor </Button>
      </div>
      <div className="flex w-[300px] justify-between">
      <Button> Execute Query </Button>
      <Button> Reset </Button>
      <Button> Back </Button>
      </div>
      </div>
    </>
  );
}

export default Reporting;