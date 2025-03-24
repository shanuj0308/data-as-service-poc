import { ExplorerData } from '@/types/explorerDataTypes';

const explorerData: ExplorerData[] = [
  {
    item_id: '1',
    item_name: 'root1',
    last_accessed: '12/12/2024',
    item_type: 'folder',
    isFolder: true,
    items: [
      {
        item_id: '2',
        item_name: 'public',
        isFolder: true,
        items: [
          {
            item_id: '3',
            item_name: 'public nested 1',
            isFolder: true,
            items: [
              {
                item_id: '4',
                item_name: 'index.html',
                isFolder: false,
                items: [],
              },
              {
                item_id: '5',
                item_name: 'hello.html',
                isFolder: false,
                items: [],
              },
            ],
          },
          {
            item_id: '6',
            item_name: 'public_nested_file',
            isFolder: false,
            items: [],
          },
        ],
      },
      {
        item_id: '7',
        item_name: 'src',
        isFolder: true,
        items: [
          {
            item_id: '8',
            item_name: 'App.js',
            isFolder: false,
            items: [],
          },
          {
            item_id: '9',
            item_name: 'Index.js',
            isFolder: false,
            items: [],
          },
          {
            item_id: '10',
            item_name: 'styles.css',
            isFolder: false,
            items: [],
          },
        ],
      },
      {
        item_id: '11',
        item_name: 'package.json',
        isFolder: false,
        items: [],
      },
    ],
  },
  {
    item_id: '11',
    item_name: 'root11',
    last_accessed: '12/12/2024',
    size: 1023,
    item_type: 'folder',
    isFolder: true,
    items: [
      {
        item_id: '12',
        item_name: 'public',
        isFolder: true,
        items: [
          {
            item_id: '13',
            item_name: 'public nested 1',
            isFolder: true,
            items: [
              {
                item_id: '14',
                item_name: 'index.html',
                isFolder: false,
                items: [],
              },
              {
                item_id: '15',
                item_name: 'hello.html',
                isFolder: false,
                items: [],
              },
            ],
          },
          {
            item_id: '16',
            item_name: 'public_nested_file',
            isFolder: false,
            items: [],
          },
        ],
      },
      {
        item_id: '17',
        item_name: 'src',
        isFolder: true,
        items: [
          {
            item_id: '18',
            item_name: 'App.js',
            isFolder: false,
            items: [],
          },
        ],
      },
      {
        item_id: '19',
        item_name: 'package.json',
        isFolder: false,
        items: [],
      },
    ],
  },
  {
    item_id: '199',
    item_name: 'package.json',
    isFolder: false,
    item_type: 'pdf',
    last_accessed: '12/12/2024',
    size: 1023,
    items: [],
  },
];

export default explorerData;
