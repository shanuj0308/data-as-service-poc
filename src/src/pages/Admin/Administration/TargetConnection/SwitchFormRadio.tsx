import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function RadioGroupOrientationDemo({ setForm }: { setForm: any }) {
  return (
    <div className='mt-6 grid gap-8'>
      <div>
        <RadioGroup
          defaultValue='select'
          className='flex items-center gap-3'
          onValueChange={(value) => setForm(value as 'select' | 'create')}
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='select' id='r1-horizontal' />
            <Label htmlFor='r1-horizontal'>Select Existing S3 Connection</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='create' id='r2-horizontal' />
            <Label htmlFor='r2-horizontal'>Create new S3 Connection</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
