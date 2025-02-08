import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QueryResultProps {
  data: Array<Record<string, any>>; // Safer type
}

export default function QueryResult({ data }: QueryResultProps) {
  if (data.length === 0) {
    return (
      <div className='mt-4 text-center text-gray-500 dark:text-gray-400'>
        No results to display.
      </div>
    );
  }

  return (
    <Card className='mt-4 rounded-xl border shadow-md dark:border-gray-700 dark:bg-gray-800'>
      <CardContent className='p-4'>
        <ScrollArea className='max-h-64 w-full'>
          <table className='min-w-full border-collapse text-sm'>
            <thead>
              <tr className='bg-gray-100 dark:bg-gray-700'>
                {Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    className='border px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100'
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className='border-t dark:border-gray-600'>
                  {Object.values(row).map((value, i) => (
                    <td
                      key={i}
                      className='border px-4 py-2 text-gray-800 dark:text-gray-300'
                    >
                      {value !== undefined && value !== null
                        ? value.toString()
                        : 'NULL'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
