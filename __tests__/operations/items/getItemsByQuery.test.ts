import { getItemsByQuery } from '../../../src/operations/items/getItemsByQuery';
import { OperationsError } from '../../../src/operations/errors';

describe('getItemsByQuery', () => {
  it('passes correct query and variables', async () => {
    const api = jest.fn().mockResolvedValue({ items_page_by_column_values: [] });
    await getItemsByQuery(api, 1, { columnId: 'status', columnValue: 'done' });
    expect(api).toHaveBeenCalledWith(expect.stringContaining('items_page_by_column_values'), {
      variables: { boardId: 1, columnId: 'status', columnValue: 'done', limit: undefined, page: undefined },
    });
  });

  it('throws OperationsError on failure', async () => {
    const api = jest.fn().mockRejectedValue(new Error('oops'));
    await expect(getItemsByQuery(api, 1, { columnId: 'c', columnValue: 'v' })).rejects.toBeInstanceOf(OperationsError);
  });
});
