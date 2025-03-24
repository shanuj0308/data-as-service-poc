import React, { useState } from 'react';
import { useTheme } from '@/context/theme-provider'// Assuming you have a theme provider
import { Button } from '../ui/button'; // Assuming you have a Button component
import { Input } from '../ui/input'; // Assuming you have an Input component
import { Select } from '../ui/select'; // Assuming you have a Select component

const S3ConnectionSelector: React.FC = () => {
  const { theme } = useTheme();
  const [option, setOption] = useState<'select' | 'create'>('select');
  const [selectedConnection, setSelectedConnection] = useState<string>('');
  const [newBucketName, setNewBucketName] = useState<string>('');

  const s3Connections = [
    { id: '1', name: 'S3 Connection 1' },
    { id: '2', name: 'S3 Connection 2' },
    { id: '3', name: 'S3 Connection 3' },
  ];

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption(e.target.value as 'select' | 'create');
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedConnection(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBucketName(e.target.value);
  };

  const handleSubmit = () => {
    if (option === 'select') {
      console.log('Selected S3 Connection:', selectedConnection);
    } else {
      console.log('New S3 Bucket Name:', newBucketName);
    }
  };

  return (
    <div className={`s3-connection-selector ${theme}`}>
      <div className="option-selector">
        <label>
          <input
            type="radio"
            value="select"
            checked={option === 'select'}
            onChange={handleOptionChange}
          />
          Select Existing S3 Connection
        </label>
        <label>
          <input
            type="radio"
            value="create"
            checked={option === 'create'}
            onChange={handleOptionChange}
          />
          Create New S3 Bucket
        </label>
      </div>

      {option === 'select' ? (
        <Select value={selectedConnection} onChange={handleSelectChange}>
          <option value="" disabled>Select an S3 Connection</option>
          {s3Connections.map((connection) => (
            <option key={connection.id} value={connection.id}>
              {connection.name}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          type="text"
          placeholder="Enter new bucket name"
          value={newBucketName}
          onChange={handleInputChange}
        />
      )}

      <Button onClick={handleSubmit}>
        {option === 'select' ? 'Select' : 'Create'}
      </Button>
    </div>
  );
};

export default S3ConnectionSelector;
