import { ReactNode, useState } from 'react';
import { DownloadIcon, FolderOpenIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface DownloadDialogProps {
  selectedItems: string[];
  trigger?: ReactNode;
}

export function DownloadDialog({ selectedItems, trigger }: DownloadDialogProps) {
  const [filePath, setFilePath] = useState('');
  const estimatedSize = 'Calculating...';

  // Function to open native directory picker
  const selectFolder = async (): Promise<void> => {
    try {
      const handle: FileSystemDirectoryHandle = await window.showDirectoryPicker();
      setFilePath(handle.name);
    } catch (error) {
      console.error('Folder selection cancelled', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='w-[400px]'>
        <DialogHeader>
          <DialogTitle>Download Files</DialogTitle>
        </DialogHeader>
        <div className='space-y-3'>
          <div className='grid gap-2'>
            <label className='font-medium text-black dark:text-white'>Selected Items</label>
            <div className='rounded-md border border-gray-300 bg-white p-2 text-sm text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white'>
              {selectedItems.length} files
            </div>
          </div>
          <div className='grid gap-2'>
            <label className='font-medium text-black dark:text-white'>Estimated Size of Download</label>
            <p className='rounded-md border border-gray-300 bg-white p-2 text-sm text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white'>
              {estimatedSize}
            </p>
          </div>
          <div className='grid gap-2'>
            <label className='font-medium text-black dark:text-white'>Save Location</label>
            <div className='flex items-center gap-2'>
              <Input
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder='Select folder'
                readOnly
              />
              <Button variant='outline' onClick={selectFolder}>
                <FolderOpenIcon className='h-5 w-5' />
              </Button>
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              onClick={() => {
                alert(`Download initiated to: ${filePath}`);
              }}
            >
              <DownloadIcon className='mr-2 h-4 w-4' />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
