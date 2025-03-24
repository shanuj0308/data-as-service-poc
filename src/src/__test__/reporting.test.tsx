import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import Reporting from '../pages/Reporting';

const mockToast = jest.fn();
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(() => ({ toast: mockToast })),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: '?archive_id=123' }),
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const queryClient = new QueryClient();
window.HTMLElement.prototype.scrollIntoView = jest.fn();

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  global.fetch = jest.fn((url) => {
    if (url.includes('schemas')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ schemas: ['Schema1'], database_name: 'test_db' }),
      });
    } else if (url.includes('tables')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['Table1']),
      });
    } else if (url.includes('columns')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['Column1']),
      });
    } else if (url.includes('execute-query')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            UpdateCount: 0,
            ResultSet: {
              Rows: [
                {
                  Data: [
                    {
                      VarCharValue: 'JOB_ID',
                    },
                  ],
                },
                {
                  Data: [
                    {
                      VarCharValue: 'AC_MGR',
                    },
                  ],
                },
                {
                  Data: [
                    {
                      VarCharValue: 'ST_CLERK',
                    },
                  ],
                },
                {
                  Data: [
                    {
                      VarCharValue: 'IT_PROG',
                    },
                  ],
                },
                {
                  Data: [
                    {
                      VarCharValue: 'FI_ACCOUNT',
                    },
                  ],
                },
                {
                  Data: [
                    {
                      VarCharValue: 'HR_REP',
                    },
                  ],
                },
                {
                  Data: [
                    {
                      VarCharValue: 'PR_REP',
                    },
                  ],
                },
                {
                  Data: [
                    {
                      VarCharValue: 'FI_MGR',
                    },
                  ],
                },
                {
                  Data: [
                    {
                      VarCharValue: 'AD_VP',
                    },
                  ],
                },
                {
                  Data: [
                    {
                      VarCharValue: 'ST_MAN',
                    },
                  ],
                },
                {
                  Data: [
                    {
                      VarCharValue: 'AC_ACCOUNT',
                    },
                  ],
                },
              ],
              ResultSetMetadata: {
                ColumnInfo: [
                  {
                    CatalogName: 'hive',
                    SchemaName: '',
                    TableName: '',
                    Name: 'JOB_ID',
                    Label: 'JOB_ID',
                    Type: 'varchar',
                    Precision: 2147483647,
                    Scale: 0,
                    Nullable: 'UNKNOWN',
                    CaseSensitive: true,
                  },
                ],
              },
            },
            NextToken:
              'ARC9GrBy1FH9IgofRlhx1w1BEWGa8spfPGg5RvkqSOcHJwpIbbSdudOEcxEr9dym94XZxu4NH8yZ4n+IrWTkX2xfc7slqRxkaQ==',
            ResponseMetadata: {
              RequestId: '2b6839eb-34f0-4221-9a32-e64b15208dec',
              HTTPStatusCode: 200,
              HTTPHeaders: {
                'date': 'Thu, 20 Feb 2025 16:36:51 GMT',
                'content-type': 'application/x-amz-json-1.1',
                'content-length': '1228',
                'connection': 'keep-alive',
                'x-amzn-requestid': '2b6839eb-34f0-4221-9a32-e64b15208dec',
              },
              RetryAttempts: 0,
            },
          }),
      });
    }
    return Promise.reject(new Error('Invalid API call'));
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Reporting Component', () => {
  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Reporting />
        </BrowserRouter>
      </QueryClientProvider>,
    );
  });

  test('renders Reporting component', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Criteria/i)).toBeInTheDocument();
      expect(screen.getByText(/Data Columns/i)).toBeInTheDocument();
    });
  });

  test('handles schema and table selection', async () => {
    fireEvent.click(screen.getByText('Select Schema'));

    await waitFor(() => {
      expect(screen.getByText('Schema1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Schema1'));

    await waitFor(() => {
      expect(screen.getByText('Schema1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Select Table')).toBeInTheDocument();
    });
  });

  test('handles query generation and preview', async () => {
    fireEvent.click(screen.getByText('Preview Query'));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: expect.any(String),
        description: expect.any(String),
      });
    });
  });

  test('handles query generation and preview', async () => {
    fireEvent.click(screen.getByText('Preview Query'));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: expect.any(String),
        description: expect.any(String),
      });
    });

    fireEvent.click(screen.getByText('Select Schema'));

    await waitFor(() => expect(screen.getByText('Schema1')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Schema1'));

    fireEvent.click(screen.getByText('Select Table'));
    fireEvent.click(screen.getByText('Table1'));

    fireEvent.click(screen.getByText('Preview Query'));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: expect.any(String),
        description: expect.any(String),
      });
    });

    fireEvent.click(screen.getByText('Table1'));

    await waitFor(() => expect(screen.getByText('Column1')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Column1'));

    expect(
      screen.getByRole('button', {
        name: /preview query/i,
        hidden: true,
      }),
    ).toBeInTheDocument();
  });

  test('executes query and displays results', async () => {
    fireEvent.click(screen.getByText('Execute Query'));
    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      const rows = within(table).getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[1]).toHaveTextContent('Column1');
    });
  });

  test('handles query execution error', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      }),
    );

    fireEvent.click(screen.getByText('Execute Query'));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Schema Missing.',
        description: expect.any(String),
      });
    });
  });

  test('resets values on reset button click', () => {
    fireEvent.click(screen.getByText('Reset'));
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  test('navigates back on Back button click', () => {
    fireEvent.click(screen.getAllByText('Back')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('handles schema selection', async () => {
    fireEvent.click(screen.getByText('Select Schema'));
    fireEvent.click(screen.getByText('Schema1'));
    await waitFor(() => {
      expect(screen.getByText('Schema1')).toBeInTheDocument();
    });
  });

  test('handles table selection', async () => {
    fireEvent.click(screen.getByText('Select Schema'));
    fireEvent.click(screen.getByText('Schema1'));
    fireEvent.click(screen.getByText('Select Table'));
    fireEvent.click(screen.getByText('Table1'));
    await waitFor(() => {
      expect(screen.getByText('Table1')).toBeInTheDocument();
    });
  });

  test('handles column selection', async () => {
    fireEvent.click(screen.getByText(/Data Columns/i));
    await waitFor(() => {
      expect(screen.getByText(/Data Columns/i)).toBeInTheDocument();
    });
  });

  test('handles where clause input', async () => {
    const whereClauseInput = screen.getByPlaceholderText("Enter Where Conditional here Ex. Column1 = 'Value'...");
    fireEvent.change(whereClauseInput, { target: { value: "Column1 = 'Value'" } });
    await waitFor(() => {
      expect(whereClauseInput).toHaveValue("Column1 = 'Value'");
    });
  });

  test('handles limit clause', async () => {
    fireEvent.click(screen.getByText('Select Limit'));
    fireEvent.click(screen.getByText('10'));
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  test('executes query and displays results', async () => {
    fireEvent.click(screen.getByText('Execute Query'));
    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      const rows = within(table).getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[1]).toHaveTextContent('Column1');
    });
  });

  test('handles query execution error', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      }),
    );

    fireEvent.click(screen.getByText('Execute Query'));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Schema Missing.',
        description: expect.any(String),
      });
    });
  });
});
