// src/components/common/LinkedApplications.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Application } from '@/types/common';

interface LinkedApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  legalHoldName: string;
  applications: Application[];
}

export function LinkedApplicationsModal({
  isOpen,
  onClose,
  legalHoldName,
  applications,
}: LinkedApplicationsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[80vh] flex-col sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Linked Applications - {legalHoldName}</DialogTitle>
        </DialogHeader>
        <div className='mt-4 flex-grow overflow-y-auto pr-1'>
          <div className='min-w-full'>
            <Table>
              <TableHeader className='sticky top-0 z-10 bg-background'>
                <TableRow>
                  <TableHead>Application Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Time Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.archive_name}</TableCell>
                      <TableCell>{app.database_engine}</TableCell>
                      <TableCell>{new Date(app.time_submitted).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className='py-4 text-center'>
                      No applications linked
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
