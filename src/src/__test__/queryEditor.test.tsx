import { fireEvent, render, screen } from '@testing-library/react';

import QueryEditor from '../components/common/QueryEditor';

describe('QueryEditor', () => {
  const schemas = ['schema1', 'schema2'];
  const tables = ['table1', 'table2'];
  const columns: string[] = ['column1', 'column2'];
  const queryResult = [{ column1: 'value1', column2: 'value2' }];

  const setSelectedSchema = jest.fn();
  const setSelectedTable = jest.fn();
  const handleCustomQuery = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    render(
      <QueryEditor
        schemas={schemas}
        tables={tables}
        setSelectedSchema={setSelectedSchema}
        setSelectedTable={setSelectedTable}
        selectedSchema={null}
        selectedTable={null}
        columns={columns}
        queryResult={queryResult}
        handleCustomQuery={handleCustomQuery}
        onClose={onClose}
      />,
    );
  });

  // test('renders the QueryEditor component', () => {
  //   expect(screen.getByText('Query Editor')).toBeInTheDocument();
  // });

  // test('displays the schema selection dropdown', () => {
  //   expect(screen.getByPlaceholderText('Select Schema')).toBeInTheDocument();
  // });

  // test('displays the table selection dropdown', () => {
  //   expect(screen.getByPlaceholderText('Select Table')).toBeInTheDocument();
  // });

  // test('displays the column view dropdown', () => {
  //   expect(screen.getByPlaceholderText('View Columns')).toBeInTheDocument();
  // });

  test('displays the custom query textarea', () => {
    expect(screen.getByPlaceholderText('Write your custom SQL query here...')).toBeInTheDocument();
  });

  test('displays the execute query button', () => {
    expect(screen.getByText('Execute Query')).toBeInTheDocument();
  });

  test('displays the cancel button', () => {
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('displays the query result', () => {
    expect(screen.getByText('value1')).toBeInTheDocument();
    expect(screen.getByText('value2')).toBeInTheDocument();
  });

  // test('calls setSelectedSchema when a schema is selected', () => {
  //   fireEvent.click(screen.getByText('schema1'));
  //   expect(setSelectedSchema).toHaveBeenCalledWith('schema1');
  // });

  // test('calls setSelectedTable when a table is selected', () => {
  //   fireEvent.click(screen.getByText('table1'));
  //   expect(setSelectedTable).toHaveBeenCalledWith('table1');
  // });

  test('calls handleCustomQuery when the execute query button is clicked', () => {
    fireEvent.click(screen.getByText('Execute Query'));
    expect(handleCustomQuery).toHaveBeenCalledWith('');
  });

  test('calls onClose when the cancel button is clicked', () => {
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
