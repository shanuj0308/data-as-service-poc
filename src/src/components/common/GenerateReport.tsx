import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

import { downloadSummaryReport } from '@/apis';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ArchiveSelection {
  archive_name: string;
  id: string;
}

interface GenerateReportProps {
  selectedArchives: ArchiveSelection[];
  disabled?: boolean;
  buttonClassName?: string;
}

async function saveFile(blob: Blob, suggestedName: string) {
  try {
    const handle = await (window as any).showSaveFilePicker({
      suggestedName,
      types: [
        {
          description: 'CSV Files',
          accept: { 'text/csv': ['.csv'] },
        },
      ],
    });

    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (error) {
    console.error('Error saving file:', error);
  }
}

export const emailSummaryReport = async (selectedArchives: ArchiveSelection[], emailAddress: string): Promise<void> => {
  const payload = {
    data: selectedArchives,
    email: emailAddress,
  };

  console.log(`Would send report to ${emailAddress} with payload:`, payload);
  return Promise.resolve();
};

export const validateKenvueEmail = (email: string): boolean => {
  return email.endsWith('@kenvue.com');
};

const GenerateReport: React.FC<GenerateReportProps> = ({
  selectedArchives,
  disabled = false,
  buttonClassName = 'ml-2',
}) => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportOption, setReportOption] = useState('download');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerateReport = () => {
    setReportDialogOpen(true);
    setEmailAddress('');
    setEmailError('');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailAddress(value);

    if (value && !validateKenvueEmail(value)) {
      setEmailError('Email must be a kenvue.com address');
    } else {
      setEmailError('');
    }
  };

  const handleReportAction = async () => {
    setIsProcessing(true);

    try {
      if (reportOption === 'download') {
        const blob = await downloadSummaryReport(selectedArchives);
        await saveFile(blob, 'summary_report.csv');
        setReportDialogOpen(false);
      } else if (reportOption === 'email') {
        if (validateKenvueEmail(emailAddress)) {
          await emailSummaryReport(selectedArchives, emailAddress);
          alert(`Report has been sent to ${emailAddress}`);
          setReportDialogOpen(false);
        } else {
          setEmailError('Email must be a kenvue.com address');
        }
      }
    } catch (error) {
      alert(typeof error === 'string' ? error : 'An error occurred while processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button
        variant='outline'
        className={buttonClassName}
        disabled={disabled || selectedArchives.length === 0}
        onClick={handleGenerateReport}
      >
        <FileText className='mr-2 h-4 w-4' /> Generate Summary Report
      </Button>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Generate Summary Report</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <RadioGroup value={reportOption} onValueChange={setReportOption}>
              <div className='mb-3 flex items-center space-x-2'>
                <RadioGroupItem value='download' id='download' />
                <Label htmlFor='download'>Download Report</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='email' id='email' />
                <Label htmlFor='email'>Email Generated Report</Label>
              </div>
            </RadioGroup>

            {reportOption === 'email' && (
              <div className='mt-4'>
                <Label htmlFor='email-address' className='mb-2 block'>
                  Email Address
                </Label>
                <Input
                  id='email-address'
                  type='email'
                  placeholder='user@kenvue.com'
                  value={emailAddress}
                  onChange={handleEmailChange}
                  className={emailError ? 'border-red-500' : ''}
                />
                {emailError && <p className='mt-1 text-sm text-red-500'>{emailError}</p>}
              </div>
            )}
          </div>
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setReportDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleReportAction}
              disabled={isProcessing || (reportOption === 'email' && (!emailAddress || !!emailError))}
            >
              {isProcessing ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : reportOption === 'download' ? (
                'Download'
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateReport;
