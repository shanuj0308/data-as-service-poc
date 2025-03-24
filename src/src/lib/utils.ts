import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

import { S3BucketObject, S3ObjectList } from '@/types/common';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validS3BucketName(name: string) {
  // Check the length
  if (name.length < 3 || name.length > 63) return false;

  // Check for valid characters (lowercase letters, numbers, hyphens, periods)
  const validCharacters = /^[a-z0-9.-]+$/;
  if (!validCharacters.test(name)) return false;

  // Check that it does not start or end with a hyphen or period
  if (name.startsWith('-') || name.endsWith('-') || name.startsWith('.') || name.endsWith('.')) return false;

  // Check that it does not look like an IP address
  const ipFormat = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  if (ipFormat.test(name)) return false;

  return true;
}

/**
 * Filters an array of objects to include only unique objects based on a specified key.
 *
 * @template T - The type of the objects in the array.
 * @param arrayData - The array of objects to filter.
 * @param key - The key to use for determining uniqueness.
 * @returns A new array containing only unique objects based on the specified key.
 */
export const fetchUniqueData = <T extends Record<string, any>>(arrayData: T[], key: keyof T): T[] => {
  return arrayData.reduce((acc, current) => {
    const existing = acc.find((item) => item[key] === current[key]);
    if (!existing) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as T[]);
};

/**
 * No Special Characters on input box
 */

export const noSpecialCharacters = z.string().regex(/^[a-zA-Z0-9\s+-.]+$/, {
  message: 'Special characters are not allowed',
});

/*
 * Filters an array of objects to include only unique objects based on a specified key.
 */
// Function to convert the input object
export const convertToObject = (input: S3BucketObject): S3ObjectList[] => {
  const result: S3ObjectList[] = [];
  const [bucketName, ...restPath] = input.s3_path.split('/').filter(Boolean);
  const itemParentPath = restPath.join('/');

  // Process folders
  input.folders.forEach((folder) => {
    result.push({
      item_name: folder.slice(0, -1), // Remove the trailing slash
      item_type: 'folder',
      size: '',
      bucketName,
      s3_path: `${itemParentPath}/${folder}`,
    });
  });

  // Process files
  input.files.forEach((file) => {
    result.push({
      item_name: file.Key,
      item_type: file.file_type,
      last_modified: new Date(file.LastModified).toLocaleString(), // Convert to a readable date format
      size: file.Size,
      bucketName,
      s3_path: `${itemParentPath}/${file.Key}`,
    });
  });

  return result;
};
