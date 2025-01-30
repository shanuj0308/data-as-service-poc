import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button';
import { DownloadIcon, MoreVerticalIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleDownload = () => {
        // Logic goes here.
        console.log('Download initiated');
        setIsPopoverOpen(false);
    };

    return (
        <div className="p-4">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleDownload}
                    >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default Dashboard;