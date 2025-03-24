import { fireEvent, render } from '@testing-library/react';

import QueryResult from '../components/common/QueryResult';

describe('QueryResult Component', () => {
  test('renders no results message when data is empty', () => {
    const { getByText } = render(<QueryResult data={[]} maxHeight={''} />);
    expect(getByText('No results to display.')).toBeInTheDocument();
  });

  test('renders table with data when data is not empty', () => {
    const data = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 25 },
    ];
    const { getByText } = render(<QueryResult data={data} maxHeight={''} />);
    expect(getByText('id')).toBeInTheDocument();
    expect(getByText('name')).toBeInTheDocument();
    expect(getByText('age')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('30')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('Jane Doe')).toBeInTheDocument();
    expect(getByText('25')).toBeInTheDocument();
  });

  test('renders NULL for undefined or null values', () => {
    const data = [
      { id: 1, name: 'John Doe', age: undefined },
      { id: 2, name: 'Jane Doe', age: null },
    ];
    const { queryAllByText } = render(<QueryResult data={data} maxHeight={''} />);
    expect(queryAllByText('NULL')).toHaveLength(2);
  });

  test('allows sorting by column', () => {
    const data = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 25 },
    ];
    const { getByText, getAllByText } = render(<QueryResult data={data} maxHeight={''} />);

    // Click on the 'age' column header to sort
    fireEvent.click(getByText('age'));

    // Check if the rows are sorted by age
    const rows = getAllByText(/Doe/);
    expect(rows[0]).toHaveTextContent('Jane Doe');
    expect(rows[1]).toHaveTextContent('John Doe');
  });

  test('allows filtering by column', () => {
    const data = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 25 },
    ];
    const { getByPlaceholderText, getByText } = render(<QueryResult data={data} maxHeight={''} />);

    // Enter a filter value in the search input
    const searchInput = getByPlaceholderText('Search all columns...');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    // Check if only the filtered row is displayed
    expect(getByText('Jane Doe')).toBeInTheDocument();
    expect(() => getByText('John Doe')).toThrow();
  });

  test('handles pagination correctly', () => {
    const data = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `Name ${i + 1}`, age: 20 + i }));
    const { getByText, getByRole } = render(<QueryResult data={data} maxHeight={''} />);

    // Check initial page content
    expect(getByText('Name 1')).toBeInTheDocument();
    expect(getByText('Name 10')).toBeInTheDocument();
    expect(() => getByText('Name 11')).toThrow();

    // Click on the 'Next' button to go to the next page
    fireEvent.click(getByRole('button', { name: /Next/i }));

    // Check next page content
    expect(getByText('Name 11')).toBeInTheDocument();
    expect(getByText('Name 20')).toBeInTheDocument();
    expect(() => getByText('Name 1')).toThrow();
  });
});
