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

  // handleDownload
  const handleDownload = (itemsToDownload: S3ObjectList[]) => {
    const selected_files = itemsToDownload.map((item) => {
      return item.s3_path;
    });

    toast({ title: 'Download triggered' });
    const payload = { bucketName: itemsToDownload[0].bucketName, selected_files };
    downloadS3Files.mutate(payload, {
      onSuccess: (res: { url: string }) => {
        toast({ title: 'Download started' });
        // / Create a hidden <a> element
        const link = document.createElement('a');
        link.href = res.url;
        link.download = 'download.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      onError: () => {
        toast({ title: 'Download failed', variant: 'destructive' });
      },
    });
  };

  // Handle download for multiple selected rows
  const handleDownloadSelected = (selectedRows: S3ObjectList[]) => {
    console.log('🚀 ~ handleDownloadSelected ~ selectedRows:', selectedRows);
    handleDownload(selectedRows);
  };

  // Handle download for a single file
  const handleDownloadSingle = (file: S3ObjectList) => {
    console.log('🚀 ~ handleDownloadSingle ~ file:', file);
    handleDownload([file]);
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
