import { useState } from 'react';
import { Check, ChevronsUpDown} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const Combobox = ({
  label,
  items,
  selectedValue,
  setSelectedValue,
  isLoading = false,
  disabled = false,
  loadingText = 'Loading...',
  allowDeselect = true,
  width = 240
}: {
  label: string;
  items: string[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  allowDeselect?: boolean;
  width?: number
}) => {
  const [open, setOpen] = useState(false);


  const isDisabled = disabled || isLoading;
  const placeholderText = isLoading ? loadingText : `Select ${label}`;

  // Handle disabled state for Popover by managing open state
  const handleOpenChange = (newOpen: boolean) => {
    if (!isDisabled) {
      setOpen(newOpen);
    }
  };

  return (
    <div className='flex flex-col justify-items-center'>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            className={cn('justify-between', isDisabled && 'cursor-not-allowed opacity-50')}
            style={{'width': `${width}px`}}
            disabled={isDisabled}
            onClick={(e) => {
              if (isDisabled) {
                e.preventDefault();
              }
            }}
          >
            <span className='truncate'>{selectedValue || placeholderText}</span>
            {selectedValue && allowDeselect ? (
              <div className='flex items-center'>
                <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
              </div>
            ) : (
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent  style={{'width': `${width}px`}} className='p-0'>
          <Command>
            <CommandInput placeholder={`Search ${label}...`} />
            <CommandList>
              <CommandEmpty>No {label} found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item}
                    onSelect={() => {
                      const newValue = selectedValue === item && allowDeselect ? '' : item;
                      setSelectedValue(newValue);
                      setOpen(false);
                    }}
                    className={cn('flex cursor-pointer items-center', {
                      'bg-accent': selectedValue === item,
                    })}
                  >
                    <Check className={cn('mr-2 h-4 w-4', selectedValue === item ? 'opacity-100' : 'opacity-0')} />
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Combobox;
