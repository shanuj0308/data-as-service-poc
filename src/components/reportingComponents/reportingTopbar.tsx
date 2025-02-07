import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReportingTopbar = ({ 
    schemas, 
    tables, 
    limits, 
    setSelectedSchema, 
    setSelectedDatabase, 
    setSelectedLimit 
  }) => {
  return (
    <>
    <div className="flex flex-row justify-between">
    <div className="flex flex-col">
      <div>Application Name</div>
      <div className="pt-3">APP0001-APPLICATION_NAME</div>
    </div>

    {/* Schema Dropdown */}
    <div className="flex flex-col">
      <div className="pb-2">Schema</div>
      <Select onValueChange={setSelectedSchema}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select Schema" />
        </SelectTrigger>
        <SelectContent>
          {schemas.map((schema) => (
            <SelectItem key={schema} value={schema}>
              {schema}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Table Dropdown */}
    <div className="flex flex-col">
      <div className="pb-2">Table</div>
      <Select onValueChange={setSelectedDatabase}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select Table" />
        </SelectTrigger>
        <SelectContent>
          {tables.map((tb) => (
            <SelectItem key={tb} value={tb}>
              {tb}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Limit Dropdown */}
    <div className="flex flex-col">
      <div className="pb-2">Limit</div>
      <Select onValueChange={setSelectedLimit}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select Limit" />
        </SelectTrigger>
        <SelectContent>
          {limits.map((limit) => (
            <SelectItem key={limit} value={limit}>
              {limit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    </div>
    </>
  )
}

export default ReportingTopbar