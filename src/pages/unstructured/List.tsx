import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RowSelectionState } from '@tanstack/react-table';

import { columns } from './ListColumns';
import { ListTable } from './ListTable';

import { useDownloadS3Files } from '@/apis/mutations';
import { useUnstructuredDataList } from '@/apis/queries';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { S3ObjectList } from '@/types/common';

// Export handleDownload for testing
export const handleDownload = async (
  itemsToDownload: S3ObjectList[],
  downloadS3Files: ReturnType<typeof useDownloadS3Files>,
) => {
  const selected_files = itemsToDownload.map((item) => item.s3_path);

  toast({ title: 'Download triggered' });
  const payload = { bucketName: itemsToDownload[0].bucketName, selected_files };
  try {
    const res = await new Promise<{ url: string }>((resolve, reject) => {
      downloadS3Files.mutate(payload, {
        onSuccess: (res) => resolve(res),
        onError: (err) => reject(err),
      });
    });

    toast({ title: 'Download started' });

    // Check if File System Access API is supported
    if ('showSaveFilePicker' in window) {
      // Prompt user to select save location
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: 'download.zip', // Default file name
        types: [
          {
            description: 'ZIP Archive',
            accept: { 'application/zip': ['.zip'] },
          },
        ],
      });

      // Fetch the file from the URL
      const response = await fetch(res.url);
      const blob = await response.blob();

      // Write the file to the selected location
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      // Fallback to default browser download
      const link = document.createElement('a');
      link.href = res.url;
      link.download = 'download.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    toast({ title: 'Download failed', variant: 'destructive' });
    console.error('Download error:', error);
  }
};

export default function ListUnstructuredData() {
  const { archive_id: archiveId } = useParams();
  const [pathHistory, setPathHistory] = useState<string[]>(['']);
  const currentPath = pathHistory[pathHistory.length - 1];
  const unstructuredList = useUnstructuredDataList(archiveId!, currentPath);
  const downloadS3Files = useDownloadS3Files();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [filterValue, setFilterValue] = useState<string>('');

  const handleFolderClick = (folder: S3ObjectList) => {
    if (folder.item_type && folder.item_name) {
      const newPath = `${currentPath}${folder.item_name}/`;
      setPathHistory([...pathHistory, newPath]);
      setRowSelection({});
      setFilterValue('');
    }
  };

  // Handle download for multiple selected rows
  const handleDownloadSelected = (selectedRows: S3ObjectList[]) => {
    handleDownload(selectedRows, downloadS3Files);
  };

  // Handle download for a single file
  const handleDownloadSingle = (file: S3ObjectList) => {
    handleDownload([file], downloadS3Files);
  };

  if (unstructuredList.isFetching) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-sm text-muted-foreground'>Loading data...</p>
        </div>
      </div>
    );
  }

  const handleGoBack = () => {
    if (pathHistory.length > 1) {
      setPathHistory(pathHistory.slice(0, -1));
      setRowSelection({});
      setFilterValue('');
    }
  };

  return (
    <div className='mx-auto'>
      <div className='mx-auto w-full max-w-screen-lg px-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-medium leading-10 tracking-tight sm:text-3xl md:text-[30px] md:leading-[3.25rem]'>
            Application Name
          </h1>
          <Link to='/dashboard' className={buttonVariants({ variant: 'outline' })}>
            Dashboard
          </Link>
        </div>
        <Separator />
        <div className='w-full'>
          <div className='flex items-center justify-center gap-2 py-4'>
            <ListTable
              onBack={pathHistory.length > 1 ? handleGoBack : undefined}
              currentPath={currentPath}
              columns={columns(handleFolderClick, handleDownloadSingle)}
              filterCol='item_name'
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              filterValue={filterValue}
              setFilterValue={setFilterValue}
              data={unstructuredList.data ?? []}
              onDownloadSelected={handleDownloadSelected}
              isDownloadPending={downloadS3Files.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
